import {auth,onAuthStateChanged, signOut} from './config.js'

const logoutBtn = document.getElementById('Logout_button');
const loginBtn = document.getElementById('Login_button');

//.......................................get current user.........................................//

const user = auth.currentUser;
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log(user);
        // User is signed in, see docs for a list of available properties
        // https://firebase.google.com/docs/reference/js/firebase.User
        const uid = user.uid;
        logoutBtn.style.display = 'block';
        loginBtn.style.display = 'none';
        // ...
    } 
    else {
        // User is signed out
        // ...
        loginBtn.style.display = 'block';
        logoutBtn.style.display = 'none';
    }
});

//........................................log out...................................................//
function logout() {
    signOut(auth).then(() => {
        // Sign-out successful.
        alert("user logged out");
        // M.toast({html: 'I am a toast!',displayLength: 500})
    }).catch((error) => {
        // An error happened.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);

    });
}

logoutBtn.addEventListener("click", logout);