const { Cashfree, CFEnvironment } = require("cashfree-pg");
const { createOrder }=require("../services/cashfreeService");
const  Payment =require('../models/payment');
const User=require('../models/users');
const jwt=require("jsonwebtoken");
const SECRET_KEY="mySecretKey";

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034", // API Key
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"  // Secret Key
);

exports.initiatePayment = async (req, res) => {
  try {
    const token = req.headers.authorization;
    const decoded = jwt.verify(token,SECRET_KEY);

    const { phone, email } = req.body;

    const orderId = "ORDER_" + Date.now();
    const amount=199;

    const sessionId = await createOrder(
      orderId,
      amount,  // Premium Subscription Fee
      decoded.userId,
      email,
      phone
    );

    await Payment.create({
      orderId,
      userId:decoded.userId,
      amount,
      paymentStatus:"PENDING"
    });

    res.json({ orderId, sessionId });

  } catch (err) {
    console.error("Payment Error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.paymentStatus=async (req,res)=>{
  const { orderId } = req.params;
  
  const response = await cashfree.PGFetchOrder(orderId);
  console.log("Payment Status:", response.data);
  res.json(response.data);
}

exports.verifyPayment = async (req, res) => {
  try {
    const { orderId } = req.params;

    const response = await cashfree.PGFetchOrder(orderId);
    const status = response.data.order_status;

    const payment = await Payment.findOne({ where: { orderId } });
    if (!payment) return res.status(404).json({ error: "Order not found" });

    await payment.update({ paymentStatus: status });

    let token = null;

    if (status === "PAID") {
      const user = await User.findByPk(payment.userId);
      await user.update({ isPremium: true });

      // 🔥 Generate NEW TOKEN containing updated premium state
      token = jwt.sign(
        { userId: user.id, name: user.name, isPremium: true },SECRET_KEY,{ expiresIn: "1h" }
      );
    }

    res.json({ message: "Payment updated", status, token });

  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};