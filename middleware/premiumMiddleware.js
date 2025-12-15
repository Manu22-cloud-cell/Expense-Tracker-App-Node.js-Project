const User = require("../models/users");

module.exports = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.user.userId);

        if (!user || !user.isPremium) {
            return res.status(403).json({
                message: "Premium membership required"
            });
        }

        // Attach full user if needed later
        req.userDetails = user;

        next();
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Server error" });
    }
};
