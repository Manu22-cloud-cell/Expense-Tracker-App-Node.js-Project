const API_URL = "http://localhost:3000/users";

function handleFormSubmit(event) {
  event.preventDefault();

  const userDetails = {
    userName:event.target.userName.value,
    email:event.target.email.value,
    password:event.target.password.value
  };

  axios
      .post(`${API_URL}/signUp`,userDetails)
      .then((response) => {
        console.log("Signup successful:",response.data);
        showMessage("Signup successful!", "success");
      })
      .catch((error)=>{
        console.log("Error during signup",error);
        if (error.response && error.response.status === 409) {
        showMessage("Email already registered!", "error");
      } else {
        showMessage("Something went wrong. Try again!", "error");
      }
      });

// Clear form inputs
  event.target.reset();
}
function showMessage(text, type) {
  const msgBox = document.getElementById("message");
  msgBox.textContent = text;
  msgBox.className = type;  // applies .success or .error CSS
}


