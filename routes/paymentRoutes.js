const express = require("express");
const { createOrder, paymentVerification } = require("../controllers/paymentController");

const router = express.Router();

router.post("/order", createOrder);
router.post("/paymentVerification", paymentVerification);

module.exports = router;
