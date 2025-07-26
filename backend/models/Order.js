//This module represents an order in the databse created by a user.

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref:'User' },
  pizzaDetails: {
    base: String,
    sauce: String,
    cheese: String,
    veggies: [String],
    meat: [String]
  },
  totalPrice: Number,
  paymentId: String,
  status: {
    type: String,
    enum: ['Order Received', 'In Kitchen', 'Sent to Delivery'],
    default: 'Order Received'
  }
}, { timestamps:true });

module.exports = mongoose.model('Order', orderSchema);