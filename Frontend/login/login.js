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

        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isPremium", res.data.isPremium ? "true" : "false");

        window.location.href = "../addExpenses/expense.html";
    })
    .catch(err => {
        console.log(err);
        alert(err.response?.data?.message || "Login failed");
    });
}

