const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: String, required: true }, 
  items: [
    {
      domain: { type: String, required: true },
      extension: { type: String, required: true },
      price: { type: Number, required: true },
      status: { type: String, required: true },
    },
  ],
  subtotal: { type: Number, required: true },
  tax: { type: Number, required: true },
  total: { type: Number, required: true },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
