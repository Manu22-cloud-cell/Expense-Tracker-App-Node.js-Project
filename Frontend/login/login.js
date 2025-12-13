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

        localStorage.setItem("username",res.data.username);
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("isPremium", res.data.isPremium ? "true" : "false");

        window.location.href = "../addExpenses/expense.html";
    })
    .catch(err => {
        console.log(err);
        alert(err.response?.data?.message || "Login failed");
    });
}

function showForgotPasswordForm() {
    document.getElementById("login-form").style.display="none";
    document.getElementById("forgot-form").style.display="block";
}

function handleForgotPassword(event) {
    event.preventDefault();

    const email=document.getElementById("forgot-email").value.toLowerCase();

    axios.post("http://localhost:3000/password/forgotpassword", {email})
        .then(res=>{
            alert(res.data.message);
        })
        .catch(err=>{
            alert(err.response?.data?.message || "Something went wrong");
        });
}

