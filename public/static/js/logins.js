var auth = firebase.auth();

function handleUserToken(user) {
    // First, check if this is an email link sign-in
    if (!firebase.auth().isSignInWithEmailLink(window.location.href)) {
        // It's an email link sign-in, process accordingly
        user.getIdToken().then((idToken) => {
            // Send the ID token to your server for verification
            fetch('/verify-token', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ id_token: idToken })
            })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    // Redirect using the URL provided by the server
                    window.location.href = data.redirect_url;
                } else {
                    // Handle failure, perhaps by displaying an error message to the user
                    console.error("Verification failed:", data.message);
                }
            })
            .catch(error => {
                // Handle any errors in the token verification process
                console.error("Error while verifying the token:", error);
            });
        });
    }
}

// Google Sign-in logic
// const googleProvider = new firebase.auth.GoogleAuthProvider();
// const googleSignInButton = document.getElementById('google-sign-in-button');

// if (googleSignInButton) {
    // googleSignInButton.onclick = function() {
        // firebase.auth().signInWithRedirect(googleProvider);
    // };
// } else {
    // console.log("Google sign-in button not found.");
// }

// firebase.auth().getRedirectResult().then((result) => {
    // if (result.user) {
        // User is signed in
        // const user = result.user;
        // handleUserToken(user);

      //}
//}).catch((error) => {
    //console.error("Error during sign-in:", error);
//});

// Microsoft Sign-in logic
// const microsoftProvider = new firebase.auth.OAuthProvider('microsoft.com');
// microsoftProvider.addScope('mail.read');

// document.getElementById('microsoft-sign-in-button').onclick = function() {
    // firebase.auth().signInWithRedirect(microsoftProvider);
// };


// Email & Password Sign-in logic
const emailLoginForm = document.getElementById('email-login-form');
const emailInput = document.getElementById('email');
const passwordInput = document.getElementById('password');

emailLoginForm.addEventListener('submit', (event) => {
    console.log("Binding the form submit event");
    event.preventDefault();  // This will prevent the form from submitting normally
    const email = emailInput.value;
    const password = passwordInput.value;
    firebase.auth().signInWithEmailAndPassword(email, password).then((userCredential) => {
        const user = userCredential.user;
        handleUserToken(user); 
    }).catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error signing in:", errorMessage);
    });
});

// Utility function to check for valid URL
function isValidURL(string) {
    try {
        new URL(string);
        return true;
    } catch (_) {
        return false;
    }
}


// The function to handle the ID token
function handleIdToken(idToken) {
    // Send the ID token to your server for verification
    fetch('/verify-token', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ id_token: idToken })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === "success") {
            // Redirect or perform actions as necessary
            window.location.href = data.redirect_url;
        } else {
            // Handle verification failure
            console.error("Token verification failed:", data.message);
        }
    })
    .catch(error => {
        console.error("Error while verifying the token:", error);
    });
}

// This flag will ensure we only process the email link sign-in once
let isProcessingEmailLinkSignIn = false;

// Only attach the onAuthStateChanged listener when needed
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
    isProcessingEmailLinkSignIn = true;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user && isProcessingEmailLinkSignIn) {
            // The user has been signed in by the email link
            isProcessingEmailLinkSignIn = false; // Prevent further processing
            
            user.getIdToken().then(function(idToken) {
                // At this point, the idToken is the viable token you're asking about
                handleIdToken(idToken);
            }).catch(function(error) {
                // Handle error in getting ID token
            });
        }
    }); // <-- Ensure this closes the onAuthStateChanged
    
    var email = window.localStorage.getItem('emailForSignIn') || prompt('Please provide your email for confirmation.');
    
    if (email) {
        firebase.auth().signInWithEmailLink(email, window.location.href)
            .then((result) => {
                window.localStorage.removeItem('emailForSignIn');
            })
            .catch((error) => {
                console.error("Error signing in with email link:", error);
            });
    } // <-- Ensure this closes the if statement checking for email
}