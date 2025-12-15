const API_URL = "http://localhost:3000/expenses";

let currentPage = 1;
const ITEMS_PER_PAGE = 10;

let editExpenseId = null; // store id when editing

// -------- MAIN ON PAGE LOAD --------
document.addEventListener("DOMContentLoaded", () => {

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Session expired. Please log in again.");
    window.location.href = "../login/login.html";
    return;
  }

  // Show Welcome username
  const username = localStorage.getItem("username");
  const welcomeDiv = document.getElementById("welcomeBox");
  if (username && welcomeDiv) {
    welcomeDiv.textContent = `Welcome ${username}!!`;
  }

  // Check premium user status and update UI
  checkPremiumStatus();

  // Load existing expenses
  getAllExpenses();

});

// -------- CRUD FUNCTIONS --------

// CREATE or UPDATE expense
function handleFormSubmit(event) {
  event.preventDefault();

  const expenseDetails = {
    amount: event.target.amount.value,
    description: event.target.description.value,
    category: event.target.category.value,
  };

  const token = localStorage.getItem("token");

  if (editExpenseId) {
    axios
      .put(`${API_URL}/update/${editExpenseId}`, expenseDetails, {
        headers: { Authorization: token },
      })
      .then(() => {
        editExpenseId = null;
        document.getElementById("add-btn").textContent = "Add Expense";
        getAllExpenses();
      })
      .catch((err) => console.log(err));
  } else {
    axios
      .post(`${API_URL}/add`, expenseDetails, {
        headers: { Authorization: token },
      })
      .then(() => getAllExpenses())
      .catch((err) => console.log(err));
  }

  event.target.reset();
}

// READ (fetch all expenses)
function getAllExpenses(page = 1) {
  axios
    .get(`${API_URL}?page=${page}&limit=${ITEMS_PER_PAGE}`, {
      headers: { Authorization: localStorage.getItem("token") }
    })
    .then((response) => {
      const expenseList = document.getElementById("expenses-list");
      expenseList.innerHTML = "";

      response.data.expenses.forEach(expense =>
        displayExpenseOnScreen(expense)
      );

      renderPagination(
        response.data.currentPage,
        response.data.totalPages
      );

      currentPage = response.data.currentPage;
    })
    .catch((err) => console.log(err));
}

function renderPagination(current, total) {
  let paginationDiv = document.getElementById("pagination");

  if (!paginationDiv) {
    paginationDiv = document.createElement("div");
    paginationDiv.id = "pagination";
    paginationDiv.style.textAlign = "center";
    paginationDiv.style.marginTop = "20px";
    document.querySelector(".left-section").appendChild(paginationDiv);
  }

  paginationDiv.innerHTML = `
    <button ${current === 1 ? "disabled" : ""} onclick="getAllExpenses(${current - 1})">
      ⬅ Prev
    </button>

    <span style="margin: 0 10px;">
      Page ${current} of ${total}
    </span>

    <button ${current === total ? "disabled" : ""} onclick="getAllExpenses(${current + 1})">
      Next ➡
    </button>

    <button ${current === total ? "disabled" : ""} onclick="getAllExpenses(${total})">
      Last
    </button>
  `;
}


// DISPLAY expenses
function displayExpenseOnScreen(expense) {
  const expenseList = document.getElementById("expenses-list");

  const li = document.createElement("li");
  li.textContent = `Rs.${expense.amount} - ${expense.description} - ${expense.category} `;

  // Edit Button
  const editBtn = document.createElement("button");
  editBtn.textContent = "Edit";
  editBtn.addEventListener("click", () => {
    document.getElementById("amount").value = expense.amount;
    document.getElementById("description").value = expense.description;
    document.getElementById("category").value = expense.category;
    document.getElementById("add-btn").textContent = "Update";
    editExpenseId = expense.id;
  });

  // Delete Button
  const deleteBtn = document.createElement("button");
  deleteBtn.textContent = "Delete";
  deleteBtn.addEventListener("click", () => {
    axios
      .delete(`${API_URL}/delete/${expense.id}`, {
        headers: { Authorization: localStorage.getItem("token") },
      })
      .then(() => {
        getAllExpenses(currentPage);
      })
      .catch((err) => console.log(err));
  });

  li.appendChild(editBtn);
  li.appendChild(deleteBtn);
  expenseList.appendChild(li);
}


// -------- PREMIUM FEATURES --------

// Trigger Payment
document.getElementById("premium-btn").addEventListener("click", () => {
  axios
    .post(
      "http://localhost:3000/payment/create-order",
      { phone: "9999999999" },
      { headers: { Authorization: localStorage.getItem("token") } }
    )
    .then((response) => {
      const { sessionId } = response.data;
      const cashfree = Cashfree({ mode: "sandbox" });
      cashfree.checkout({ paymentSessionId: sessionId });
    })
    .catch((error) => {
      alert("Payment could not start. Try again.");
      console.error(error);
    });
});

//Generate report
document.getElementById("reports-btn").addEventListener("click", () => {
  window.location.href = "../reports/reports.html";
});

// Check premium and update UI
function checkPremiumStatus() {
  const isPremium = localStorage.getItem("isPremium");
  if (isPremium === "true") {
    showPremiumBadge();
    document.getElementById("premium-btn").style.display = "none";
    document.getElementById("reports-btn").style.display = "inline-block";
  }
}

function showPremiumBadge() {
  const header = document.getElementById("header");

  // Premium Badge
  const badge = document.createElement("span");
  badge.textContent = "Premium Member";
  badge.classList.add("premium-badge");

  // Leaderboard Button
  const leaderBoardBtn = document.createElement("button");
  leaderBoardBtn.textContent = "Show Leaderboard";
  leaderBoardBtn.classList.add("leaderboard-btn");
  leaderBoardBtn.addEventListener("click", getLeaderboard);

  header.appendChild(badge);
  header.appendChild(leaderBoardBtn);
}

// -------- LEADERBOARD --------
function getLeaderboard() {
  axios
    .get("http://localhost:3000/expenses/leaderboard", {
      headers: { Authorization: localStorage.getItem("token") },
    })
    .then((response) => {
      const leaderboard = response.data;
      const container = document.getElementById("leaderboard-container");
      container.classList.remove("hidden");

      container.innerHTML = `
        <h3>Leaderboard</h3>
        <table border="1" style="border-collapse: collapse; width: 50%; margin-top: 10px;">
          <tr style="background: #eee;">
            <th>Name</th>
            <th>Total Expense</th>
          </tr>
          ${leaderboard
          .map(
            (user) => `
            <tr>
              <td>${user.userName || "Unknown"}</td>
              <td>₹${user.totalExpense || 0}</td>
            </tr>`
          )
          .join("")}
        </table>
      `;
    })
    .catch((err) => {
      alert("Unable to load leaderboard");
      console.log(err);
    });
}

