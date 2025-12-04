
//protect expense page
if (!localStorage.getItem("user")) {
    alert("Please login first!");
    window.location.href = "login.html";
}

const API_URL = "http://localhost:3000/expenses";

let editExpenseId = null; // store id when editing

// CREATE or UPDATE expense
function handleFormSubmit(event) {
  event.preventDefault();

  const expenseDetails = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };

  if (editExpenseId) {
    // UPDATE (PUT)
    axios
      .put(`${API_URL}/update/${editExpenseId}`,expenseDetails)
      .then(() => {
        console.log("Expense details has been updated")
        editExpenseId = null;
        document.getElementById("add-btn").textContent = "Submit";
        getAllExpenses(); // refresh list
      })
      .catch((err) => console.log(err));
  } else {
    // CREATE (POST)
    axios
      .post(`${API_URL}/add`,expenseDetails)
      .then((response) => {
        displayExpenseOnScreen(response.data);
      })
      .catch((error) => console.log(error));
  }

  // Clear form inputs
  event.target.reset();
}

// READ (GET) — fetch all expenses on page load
window.addEventListener("DOMContentLoaded", getAllExpenses);

function getAllExpenses() {
  axios
    .get(API_URL)
    .then((response) => {
      const expenseList = document.getElementById("expenses-list");
      expenseList.innerHTML = ""; // clear existing list
      response.data.forEach((expense) => displayExpenseOnScreen(expense));
    })
    .catch((error) => console.log(error));
}

// DISPLAY expenses on screen
function displayExpenseOnScreen(expenseDetails) {
  const expenseList = document.getElementById("expenses-list");

  const expenseItem = document.createElement("li");
  expenseItem.textContent = `Rs.${expenseDetails.amount} - ${expenseDetails.description} - ${expenseDetails.category} `;

  // Delete button 
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";

  deleteBtn.addEventListener("click", () => {
    // DELETE
    axios
      .delete(`${API_URL}/delete/${expenseDetails.id}`)
      .then(() => {
        expenseList.removeChild(expenseItem);
        console.log("Expense details deleted successfully");
      })
      .catch((err) => console.log(err));
  });

  // Edit button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";

  editBtn.addEventListener("click", () => {
    // Fill form with current details
    document.getElementById("amount").value = expenseDetails.amount;
    document.getElementById("description").value = expenseDetails.description;
    document.getElementById("category").value = expenseDetails.category;
    document.getElementById("add-btn").textContent = "Update";

    // Save the id for PUT request
    editExpenseId = expenseDetails.id;
  });

  expenseItem.appendChild(editBtn);
  expenseItem.appendChild(deleteBtn);
  expenseList.appendChild(expenseItem);
}