const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "1234";


function login() {

    const username =
        document.getElementById("username").value.trim();

    const password =
        document.getElementById("password").value;

    const error =
        document.getElementById("error");


    console.log("Login button clicked");

    console.log("Username:", username);

    console.log("Password entered:", password);


    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {

        console.log("LOGIN SUCCESS");

        localStorage.setItem(
            "smartIT_loggedIn",
            "true"
        );

        window.location.href = "home.html";

    } else {

        console.log("LOGIN FAILED");

        error.textContent =
            "Invalid email or password.";

    }

}