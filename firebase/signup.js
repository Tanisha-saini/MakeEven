import { app, database, auth,createUserWithEmailAndPassword } from "./config.js";
import { collection,addDoc } from "https://www.gstatic.com/firebasejs/9.17.2/firebase-firestore.js";

//............................REFERENCES............................//
// const Fname = document.getElementById("firstName");
// const Lname = document.getElementById("lastName");
const email = document.getElementById("email");
const pswrd = document.getElementById("password");
const cnfrmpswrd = document.getElementById("cnfrmpassword");
// const bdate = document.getElementById("birthDate");
// const pno = document.getElementById("phoneNumber");
// const gender = document.getElementsByName('gender')[0];
// const ageGroup = document.getElementsByName('age-group')[0];
// const country = document.getElementById("country");
// const state = document.getElementById("state");
// const address = document.getElementById("address");
// const intro = document.getElementById("intro");

const submit = document.getElementById("register_btn");

//..................................VALIDATION.........................//
function validation() {
    let nameregex = /^[a-zA-Z\s]+$/;
    let emailregex = /^[a-zA-Z0-9]+@(gmail|yahoo|outlook)\.com$/;

    if (!emailregex.test(email.value)) {
        console.log(email.value);
        alert("Enter a valid email");
        return false;
    }

    if (pswrd.value != cnfrmpswrd.value) {
        alert("passwords does not match");
        return false;
    }
    return true;
}
//...............................................REGISTER USER TO FIREBASE.........................................//
function RegisterUser() {
    if (!validation()) {
        return;
    }
    createUserWithEmailAndPassword(auth, email.value, pswrd.value)
        .then((userCredential) => {
            // Signed in
            // const user = userCredential.user;
            // set(ref(database, 'users/' + user.uid), {
            //     email: email.value,
            // })
            const user = userCredential.user;
            addDoc(collection(database, "users"), {
                uid: user.uid,
                email: email.value,
            }).then((docRef) => {
                console.log("anmol Document written with ID: ", docRef.id);
                alert("user created");
            });
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;

            alert(errorCode, errorMessage);
        });
}

//..................................................ASSIGN THE EVENTS..............................//
submit.addEventListener("click", RegisterUser);
