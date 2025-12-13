const User = require('../models/users');
const sequelize = require("../utils/db-connection");

exports.getLeaderboard = async (req, res) => {
  try {
    const leaderboard = await User.findAll({
      attributes: ["userName", "totalExpense"],
      order: [["totalExpense", "DESC"]]
    });

    res.status(200).json(leaderboard);
  } catch (error) {
    console.log("Leaderboard ERROR:", error);
    res.status(500).json({ message: "Unable to fetch leaderboard" });
  }
};


