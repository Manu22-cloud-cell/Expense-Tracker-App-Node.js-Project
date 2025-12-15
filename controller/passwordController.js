const tranEmailApi = require("../utils/email");
const bcrypt = require("bcryptjs");
const ForgotPasswordRequests = require("../models/forgotPasswordReq");
const User = require("../models/users");
const path = require("path");

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const request = await ForgotPasswordRequests.create({
      userId: user.id
    });

    const resetLink = `http://localhost:3000/password/resetpassword/${request.id}`;

    await tranEmailApi.sendTransacEmail({
      sender: {
        email: "manojkymanu6@gmail.com", // MUST be verified
        name: "Expense Tracker"
      },
      to: [{ email }],
      subject: "Reset your password",
      htmlContent: `
        <h3>Password Reset</h3>
        <p>Click the link below to reset your password:</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    });

    res.status(200).json({ message: "Reset email sent successfully" });

  } catch (err) {
    console.error("Sendinblue Error:", err);
    res.status(500).json({ message: "Failed to send reset email" });
  }
}

const resetPasswordPage = async (req, res) => {
  try {
    const { id } = req.params;

    const request = await ForgotPasswordRequests.findOne({
      where: { id, isActive: true }
    })

    if (!request) {
      return res.status(400).send("Link expired or invalid");
    }

    res.sendFile(
      path.join(__dirname, "../Frontend/password/resetPassword.html")
    );

  } catch (error) {
    res.status(500).send("Error loading reset page");
  }
}

const updatePassword = async (req, res) => {
  try {
    const { id } = req.params;
    const { password } = req.body;

    console.log("BODY:", req.body);

    const request = await ForgotPasswordRequests.findOne({
      where: { id, isActive: true }
    });

    if (!request) {
      return res.status(400).send("Invalid or expired link");
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await User.update(
      { password: hashedPassword },
      { where: { id: request.userId } }
    );

    await ForgotPasswordRequests.update(
      { isActive: false },
      { where: { id } }
    );

    res.send("<h3>Password updated successfully. You can login now.</h3>");
  } catch (error) {
    res.status(500).send("Failed to reset password");
  }
}



module.exports = {
  forgotPassword,
  resetPasswordPage,
  updatePassword
};
