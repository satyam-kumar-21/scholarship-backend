const crypto = require("crypto");
const Payment = require("../models/paymentModel");
const Razorpay = require("razorpay");

// Initialize Razorpay instance with environment variables
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || "rzp_test_g6eiOXSsKay9YG", // Use environment variable for key_id
  key_secret: process.env.RAZORPAY_KEY_SECRET || "cW9VZSRcSEnSnTRKOrdt3pwn", // Use environment variable for key_secret
});

// Create Razorpay Order
const createOrder = async (req, res) => {
  try {
    const { amount } = req.body;

    if (!amount || isNaN(amount)) {
      return res.status(400).json({
        success: false,
        message: "Invalid or missing amount.",
      });
    }

    const options = {
      amount: Number(amount * 100), // Convert to paise (smallest currency unit)
      currency: "INR",
    };

    const order = await instance.orders.create(options);

    return res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    console.error("Error creating order:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to create order. Please try again.",
    });
  }
};

// Payment Verification
const paymentVerification = async (req, res) => {
  try {
    const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body;

    if (!razorpay_payment_id || !razorpay_order_id || !razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Missing payment details.",
      });
    }

    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return res.status(500).json({
        success: false,
        message: "Razorpay secret key not found.",
      });
    }

    const body = `${razorpay_order_id}|${razorpay_payment_id}`;

    // Generate expected signature
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(body)
      .digest("hex");

    const isAuthentic = expectedSignature === razorpay_signature;

    if (isAuthentic) {
      // Save payment details to the database
      const newPayment = new Payment({
        razorpay_payment_id,
        razorpay_order_id,
        razorpay_signature,
      });
      await newPayment.save();

      // Redirect to success page
      return res.redirect(
        `${process.env.CLIENT_URL || "http://localhost:5173"}/paymentsuccess?reference=${razorpay_payment_id}`
      );
    } else {
      return res.status(400).json({
        success: false,
        message: "Payment verification failed.",
      });
    }
  } catch (error) {
    console.error("Error verifying payment:", error.message);  // Log the error message for better understanding
    return res.status(500).json({
      success: false,
      message: "Payment verification failed due to server error.",
    });
  }
};

module.exports = {
  createOrder,
  paymentVerification,
};
