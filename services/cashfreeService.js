const { Cashfree, CFEnvironment } = require("cashfree-pg");

const cashfree = new Cashfree(
  CFEnvironment.SANDBOX,
  "TEST430329ae80e0f32e41a393d78b923034", // API Key
  "TESTaf195616268bd6202eeb3bf8dc458956e7192a85"  // Secret Key
);

exports.createOrder = async (orderId, amount, customerId, email, phone) => {
  try {
    const request = {
      order_id: orderId,
      order_amount: amount,
      order_currency: "INR",
      customer_details: {
        customer_id: customerId.toString(),
        customer_email: email || "test@example.com",
        customer_phone: phone || "9999999999",
      },
      order_meta: {
        return_url: `http://localhost:3000/payment/success.html?orderId=${orderId}`,
      }
    };

    console.log("Cashfree Request:", request);

    const response = await cashfree.PGCreateOrder(request);

    console.log("Cashfree Response:", response.data);

    return response.data.payment_session_id;

  } catch (err) {
    console.error("Cashfree Order Error:", err.response?.data || err.message);
    return null;
  }
};