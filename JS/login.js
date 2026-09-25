// =========================================================
// Smart IT Web Demo - Login
// LocalStorage Version
// =========================================================

const DEMO_USERNAME = "admin";
const DEMO_PASSWORD = "1234";


// =========================================================
// Login
// =========================================================

function login() {

    const usernameElement =
        document.getElementById("username");

    const passwordElement =
        document.getElementById("password");

    const errorElement =
        document.getElementById("error");


    const username =
        usernameElement
            ? usernameElement.value.trim()
            : "";

    const password =
        passwordElement
            ? passwordElement.value
            : "";


    // Clear previous error

    if (errorElement) {

        errorElement.textContent = "";

    }


    // Validate Login

    if (
        username === DEMO_USERNAME &&
        password === DEMO_PASSWORD
    ) {

        // Save demo login state

        localStorage.setItem(
            "smartIT_loggedIn",
            "true"
        );


        // Open Home / Dashboard

        window.location.href =
            "home.html";

        return;

    }


    // Invalid Login

    if (errorElement) {

        errorElement.textContent =
            "Invalid username or password.";

    } else {

        alert(
            "Invalid username or password."
        );

    }
}


// =========================================================
// Enter Key Support
// =========================================================

document.addEventListener(
    "keydown",
    function(event) {

        if (event.key === "Enter") {

            const usernameElement =
                document.getElementById("username");

            const passwordElement =
                document.getElementById("password");


            if (
                usernameElement &&
                passwordElement
            ) {

                login();

            }

        }

    }
);
