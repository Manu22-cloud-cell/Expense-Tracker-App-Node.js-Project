const API_URL = "http://localhost:3000/users";

function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById("email").value.toLowerCase();
    const password = document.getElementById("password").value;

    axios.post(`${API_URL}/login`, { email, password })
        .then(res => {
            alert("Login Successful!");

     // Store token
     localStorage.setItem("token",res.data.token);

     // Redirect to expense page
     window.location.href = "../addExpenses/expense.html";

        })
        .catch(err => {
            alert(err.response?.data?.message || "Login failed");
        });

    event.target.reset();
}

