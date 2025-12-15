const express = require("express");
const router = express.Router();
const reportController = require("../controller/reportController");
const authenticate = require("../middleware/auth");
const premiumMiddleware = require("../middleware/premiumMiddleware");


router.get("/", authenticate, premiumMiddleware, reportController.getReports);

module.exports = router;







