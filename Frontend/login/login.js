const API_URL = "http://localhost:3000/users";

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("password").value;

    axios
        .post(`${API_URL}/login`, { email, password })
        .then(res => {

            if (!res.data.token) {
                throw new Error("No token received");
            }

            alert("Login Successful!");

            localStorage.setItem("username", res.data.username);
            localStorage.setItem("token", res.data.token);
            localStorage.setItem("isPremium", res.data.isPremium ? "true" : "false");

            window.location.href = "../addExpenses/expense.html";
        })
        .catch(err => {
            console.log(err);
            alert(err.response?.data?.message || "Login failed");
        });

    event.target.reset();
}

function showForgotPasswordForm() {
    document.getElementById("forgot-form").style.display = "block";
}

function handleForgotPassword(e) {
    e.preventDefault();

    const email = document.getElementById("forgot-email").value;

    axios.post("http://localhost:3000/password/forgotpassword", { email })
        .then(() => alert("Reset link sent to your email"))
        .catch(() => alert("Error sending reset email"));
}


