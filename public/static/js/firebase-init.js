
var firebaseConfig = {
        apiKey: "AIzaSyAqO_WgWSOq8Fia7meWVxprMGmcE8Ai-gM",
        authDomain: "pgmodebrochurev1.firebaseapp.com",
        projectId: "pgmodebrochurev1",
        storageBucket: "pgmodebrochurev1.appspot.com",
        messagingSenderId: "897794402759",
        appId: "1:897794402759:web:cddf7175eaad79940051e2",
        measurementId: "G-CJH61C6ED4"
    };


  
if (typeof firebase !== "undefined") {
  if (!firebase.apps.length) {
      firebase.initializeApp(firebaseConfig);
  } else {
      firebase.app(); // if already initialized, use that one
  }
} else {
  console.error("Firebase not loaded");
}

