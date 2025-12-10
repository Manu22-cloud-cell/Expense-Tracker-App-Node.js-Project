const { User, Expenses } = require("../models");
const sequelize = require("../utils/db-connection");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: [
        "userName",
        [sequelize.fn("SUM", sequelize.col("expenses.amount")), "totalExpense"]
      ],
      include: [
        {
          model: Expenses,
          attributes: []
        }
      ],
      group: ["users.id"],
      order: [[sequelize.fn("SUM", sequelize.col("expenses.amount")), "DESC"]]
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.log("\n🔥 Leaderboard ERROR:\n", error);
    res.status(500).json({ message: "Unable to fetch leaderboard" });
  }
};


