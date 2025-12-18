const API_BASE_URL="http://localhost:3000"

const isPremium = localStorage.getItem("isPremium");

if (isPremium !== "true") {
  document.getElementById("report-section").style.display = "none";
  document.getElementById("premium-warning").classList.remove("hidden");
  document.getElementById("download-btn").disabled = true;
}

async function fetchReport() {
  const type = document.getElementById("report-type").value;

  const res = await axios.get(
    `${API_BASE_URL}/reports?type=${type}`,
    {
      headers: { Authorization: localStorage.getItem("token") }
    }
  );

  if (type === "yearly") {
    renderYearlyTable(res.data.data, res.data.total);
  } else {
    renderExpenseTable(res.data.expenses, res.data.totalExpense);
  }
}
function renderYearlyTable(data, total) {
  const monthNames = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
  ];

  let html = `
    <tr>
      <th>Month</th>
      <th>Expense</th>
    </tr>
  `;

  data.forEach(row => {
    const monthName = monthNames[row.month - 1]; // DB gives 1–12

    html += `
      <tr>
        <td>${monthName}</td>
        <td>₹${row.expense}</td>
      </tr>
    `;
  });

  html += `
    <tr>
      <td><strong>Total</strong></td>
      <td><strong>₹${total}</strong></td>
    </tr>
  `;

  document.getElementById("report-table").innerHTML = html;
}


function renderExpenseTable(expenses, total) {
  let html = `
    <tr>
      <th>Date</th>
      <th>Description</th>
      <th>Category</th>
      <th>Note</th>
      <th>Expense</th>
    </tr>
  `;

  expenses.forEach(e => {
    html += `
      <tr>
      <td>${new Date(e.createdAt).toLocaleDateString()}</td>
      <td>${e.description}</td>
      <td>${e.category || "AI Selected"}</td>
      <td>${e.note || "-"}</td>
      <td>₹${e.amount}</td>
    </tr>
    `;
  });

  html += `
    <tr>
      <td colspan="4"><strong>Total</strong></td>
      <td><strong>₹${total}</strong></td>
    </tr>
  `;

  document.getElementById("report-table").innerHTML = html;
}

function downloadReport() {
  let csv = "";
  document.querySelectorAll("#report-table tr").forEach(row => {
    const cols = row.querySelectorAll("td, th");
    csv += [...cols].map(c => c.innerText).join(",") + "\n";
  });

  const blob = new Blob([csv], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "expense-report.csv";
  link.click();
}


