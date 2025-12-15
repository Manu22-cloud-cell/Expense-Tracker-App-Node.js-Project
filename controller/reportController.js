const { Op, fn, col, where, literal } = require("sequelize");
const Expense = require("../models/expenses");

/**
 * GET /reports?type=daily|monthly|yearly
 */
exports.getReports = async (req, res) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { type, date, month, year } = req.query;

    if (type === "daily") {
      return getDailyReport(res, userId, date);
    }

    if (type === "monthly") {
      return getMonthlyReport(res, userId, month, year);
    }

    if (type === "yearly") {
      return getYearlyReport(res, userId, year);
    }

    res.status(400).json({ message: "Invalid report type" });
  } catch (error) {
    console.error("REPORT ERROR:", error);
    res.status(500).json({ message: "Failed to generate report" });
  }
};

/* ---------------- DAILY ---------------- */
async function getDailyReport(res, userId, date) {
  if (!date) {
    date = new Date().toISOString().split("T")[0]; // today
  }

  const start = new Date(`${date} 00:00:00`);
  const end = new Date(`${date} 23:59:59`);

  const expenses = await Expense.findAll({
    where: {
      userId,
      createdAt: {
        [Op.between]: [start, end]
      }
    },
    order: [["createdAt", "ASC"]]
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({ expenses, totalExpense });
}

/* ---------------- MONTHLY ---------------- */
async function getMonthlyReport(res, userId, month, year) {
  if (!month || !year) {
    const now = new Date();
    month = now.getMonth() + 1;
    year = now.getFullYear();
  }

  const expenses = await Expense.findAll({
    where: {
      userId,
      [Op.and]: [
        where(fn("MONTH", col("createdAt")), month),
        where(fn("YEAR", col("createdAt")), year)
      ]
    },
    order: [["createdAt", "ASC"]]
  });

  const totalExpense = expenses.reduce((sum, e) => sum + e.amount, 0);

  res.json({ expenses, totalExpense });
}

/* ---------------- YEARLY ---------------- */
async function getYearlyReport(res, userId, year) {
  if (!year) {
    year = new Date().getFullYear();
  }

  const data = await Expense.findAll({
    attributes: [
      [fn("MONTH", col("createdAt")), "month"],
      [fn("SUM", col("amount")), "expense"]
    ],
    where: {
      userId,
      [Op.and]: [
        where(fn("YEAR", col("createdAt")), year)
      ]
    },
    group: [fn("MONTH", col("createdAt"))],
    order: [[literal("month"), "ASC"]]
  });

  const total = data.reduce(
    (sum, e) => sum + Number(e.get("expense")),
    0
  );

  res.json({ data, total });
}


