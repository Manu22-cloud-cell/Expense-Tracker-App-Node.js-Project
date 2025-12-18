const { Op, fn, col, where, literal } = require("sequelize");
const Expense = require("../models/expenses");


//GET /reports?type=daily|monthly|yearly
 
exports.getReports = async (req, res, next) => {
  try {
    const userId = req.user.userId; // from auth middleware
    const { type, date, month, year } = req.query;

    let result;

    if (type === "daily") {
      result = await getDailyReport(userId, date);
    } 
    else if (type === "monthly") {
      result = await getMonthlyReport(userId, month, year);
    } 
    else if (type === "yearly") {
      result = await getYearlyReport(userId, year);
    } 
    else {
      const err = new Error("Invalid report type");
      err.statusCode = 400;
      throw err;
    }

    res.status(200).json(result);

  } catch (error) {
    error.statusCode = error.statusCode || 500;
    next(error);
  }
};

//DAILY 

async function getDailyReport(userId, date) {
  if (!date) {
    date = new Date().toISOString().split("T")[0];
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

  return { expenses, totalExpense };
}

//MONTHLY

async function getMonthlyReport(userId, month, year) {
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

  return { expenses, totalExpense };
}

//YEARLY

async function getYearlyReport(userId, year) {
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

  return { data, total };
}



