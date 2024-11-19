const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  domains: [
    {
      domain: String,
      status: String,
      price: {
        product: {
          price: Number,
          currency: String,
        },
        reseller: {
          price: Number,
          currency: String,
        },
      },
    },
  ],
  subtotal: Number,
  tax: Number,
  total: Number,
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Order", orderSchema);
