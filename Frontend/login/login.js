const API_URL = "http://localhost:3000/users";

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    axios.post(`${API_URL}/login`, { email, password })
        .then(res => {
            showLoginMessage("User logged in successfully!", "success");
            
            // Optional: Redirect after success
            // setTimeout(() => window.location.href = "dashboard.html", 2000);
        })
        .catch(err => {
            if (err.response) {
                // fetch backend message
                showLoginMessage(err.response.data.message, "error");
            } else {
                showLoginMessage("Something went wrong!", "error");
            }
        });

    event.target.reset();
}

function showLoginMessage(text, type) {
    const msg = document.getElementById("login-message");
    msg.textContent = text;
    msg.className = type;
}
