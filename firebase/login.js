import {auth,app,onAuthStateChanged,signInWithEmailAndPassword} from './config.js';
import { GoogleAuthProvider, signInWithPopup, FacebookAuthProvider } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-auth.js";
//............................REFERENCES............................//
const email = document.getElementById("login_email");
const pswrd = document.getElementById("login_password");

const login = document.getElementById("login");
const loginbygoogle = document.getElementById("googlesignin");
const loginbyfb = document.getElementById("facebooksignin");

//...............................................login USER .........................................//   
function LoginUser() {
    signInWithEmailAndPassword(auth, email.value, pswrd.value)
        .then((userCredential) => {
            // Signed in 
            const user = userCredential.user;
            const dt = new Date();
            update(ref(database, 'users/' + user.uid), {
                last_login: dt
            })
            alert('user logged in');
            // ...
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            alert(errorMessage);
        });

}
//.....................................................Google login...........................................//
function googlelogin() {
    const provider = new GoogleAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // This gives you a Google Access Token. You can use it to access the Google API.
            const credential = GoogleAuthProvider.credentialFromResult(result);
            const token = credential.accessToken;
            // The signed-in user info.
            const user = result.user;
            // IdP data available using getAdditionalUserInfo(result)
            // ...
            console.log(result);
        }).catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = GoogleAuthProvider.credentialFromError(error);
            // ...
            console.log(errorMessage);
        });
}

//.................................................Facebook login...................................//
function facebooklogin() {
    const provider = new FacebookAuthProvider();
    signInWithPopup(auth, provider)
        .then((result) => {
            // The signed-in user info.
            const user = result.user;

            // This gives you a Facebook Access Token. You can use it to access the Facebook API.
            const credential = FacebookAuthProvider.credentialFromResult(result);
            const accessToken = credential.accessToken;

            // IdP data available using getAdditionalUserInfo(result)
            // ...
            console.log(result);
        })
        .catch((error) => {
            // Handle Errors here.
            const errorCode = error.code;
            const errorMessage = error.message;
            // The email of the user's account used.
            const email = error.customData.email;
            // The AuthCredential type that was used.
            const credential = FacebookAuthProvider.credentialFromError(error);

            // ...
            console.log(errorMessage);
        });
}

//.......................................get current user.........................................//
const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        // const displayName = user.displayName;
        // const email = user.email;
        // const photoURL = user.photoURL;
        // const emailVerified = user.emailVerified;
        console.log("current user: ", uid);
        window.location = "index.html";
        // ...
    } else {
        // User is signed out
        // ...
        // var loginBtn = document.getElementsByClassName("Login_button")[0];
        // loginBtn.value = "Login";
    }
});

//..................................................ASSIGN THE EVENTS..............................//   
login.addEventListener("click", LoginUser);
loginbygoogle.addEventListener("click", googlelogin);
loginbyfb.addEventListener("click", facebooklogin);