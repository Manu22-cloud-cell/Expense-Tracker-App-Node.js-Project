const express = require("express");
const router = express.Router();
const { getLeaderboard } = require("../controller/leaderBoardController");
const auth = require("../middleware/auth");

router.get("/leaderboard", auth, getLeaderboard);

module.exports = router;







