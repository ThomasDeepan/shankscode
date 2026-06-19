const Workshop = require("./workshop.model");

exports.createWorkshop = async (req, res) => {
  try {
    const workshop = await Workshop.create(req.body);
    res.status(201).json({ success: true, data: workshop });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.getAllWorkshops = async (req, res) => {
  try {
    const workshops = await Workshop.find().sort({ date: 1 });
    res.status(200).json({ success: true, data: workshops });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// --- PAYMENT INTEGRATION HANDSHAKE ---
exports.initializeCheckout = async (req, res) => {
  try {
    const workshop = await Workshop.findById(req.params.id);
    if (!workshop)
      return res
        .status(404)
        .json({ success: false, message: "Workshop not found" });

    let finalAmount = workshop.price;

    // Simple Coupon Discount Logic Check
    if (req.body.couponCode === "LEARN20") {
      finalAmount = finalAmount * 0.8; // Apply 20% discount
    }

    // HERE: You would call your Payment Gateway API (Stripe/Razorpay)
    // e.g., const order = await razorpay.orders.create({ amount: finalAmount * 100, currency: "INR" });

    res.status(200).json({
      success: true,
      message: "Payment intent initialized successfully.",
      amountToPay: finalAmount,
      currency: "USD",
      gatewayOrderId: "mock_order_id_unlocked", // Pass this to frontend to open checkout modal
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
