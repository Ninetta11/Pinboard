// Globals
let loginStatus = false;
var firebaseConfig = {
  apiKey: "AIzaSyBnhiM0nSJJ4uZgQhtb2hxX5p9d7pZF6C8",
  authDomain: "pinboard-5f12a.firebaseapp.com",
  databaseURL: "https://pinboard-5f12a.firebaseio.com",
  projectId: "pinboard-5f12a",
  storageBucket: "pinboard-5f12a.appspot.com",
  messagingSenderId: "561182051067",
  appId: "1:561182051067:web:82909361b13e9e8209be5e",
};

// Elements

// Functions

// Event listeners

// Main program
firebase.initializeApp(firebaseConfig);
firebase
  .auth()
  .setPersistence(firebase.auth.Auth.Persistence.SESSION)
  .then(function () {
    // Existing and future Auth states are now persisted in the current
    // session only. Closing the window would clear any existing state even
    // if a user forgets to sign out.
    // ...
    // New sign-in will be persisted with session persistence.
    return firebase.auth().signInWithEmailAndPassword(email, password);
  })
  .catch(function (error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
  });
const ui = new firebaseui.auth.AuthUI(firebase.auth());
ui.start("#login-container", {
  signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  signInSuccessUrl: "admin.html",
  callbacks: {
    signInSuccessWithAuthResult: (authResult, redirectUrl) => {
      console.log(authResult.redirectUrl);
      return true;
    },
  },
});

// Testing
