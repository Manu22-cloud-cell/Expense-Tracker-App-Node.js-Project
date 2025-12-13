const Users = require("../models/users");
const Sib = require("sib-api-v3-sdk");

const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await Users.findOne({ where: { email } });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Send email using Brevo(Ex Sendinblue)
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications["api-key"];
        apiKey.apiKey = process.env.SENDINBLUE_API_KEY;

        const tranEmailApi = new Sib.TransactionalEmailsApi();

        const sender = {
            email: "manojkymanu6@gmail.com",
            name: "Expense Tracker App"
        }

        const receivers = [
            { email: email }
        ];

        await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: "Password Reset Request",
            htmlContent: `
                <h3>Password Reset</h3>
                <p>This is a dummy email for forgot password feature.</p>
                <p>You can later add reset link here.</p>
            `
        });

        res.status(200).json({ message: "Password reset email sent successfully" });


    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Failed to send email" });
    }
}

module.exports = { forgotPassword };
