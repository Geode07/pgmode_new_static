document.addEventListener('DOMContentLoaded', function() {
    var actionCodeSettings = {
        url: 'https://client-access.pgmode.com/',
        handleCodeInApp: true,
    };

    function isValidEmail(email) {
        return /\S+@\S+\.\S+/.test(email);
    }

    function sendSignInLink(email) {
        if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
            return;
        }

        firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
            .then(() => {
                window.localStorage.setItem('emailForSignIn', email); // Save the email locally to retrieve it later
                console.log("Sign-in link sent to " + email);
                alert('Check your email for the sign-in link.');
            })
            .catch((error) => {
                console.error("Failed to send sign-in link", error);
                alert('Failed to send sign-in link. Please try again.');
            });
    }

    document.getElementById('sendLinkForm').addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting in the traditional way
        var email = document.getElementById('userEmail').value;
        sendSignInLink(email);
    });
});