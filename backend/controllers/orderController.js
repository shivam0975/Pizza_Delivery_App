//This module handles the order placing , veiwing all orders and fetching orders and others

const Razorpay = require('razorpay');
const crypto = require('crypto');
const Order = require('../models/Order');
const Inventory = require('../models/Inventory');
const { adminEmailNotifyIfLowStock } = require('../utils/stockNotifier');

const razorpayInstance = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req,res) => {
  const { pizzaDetails, totalPrice } = req.body;
  try {
    // Create razorpay order for frontend payment
    const options = {
      amount: totalPrice * 100, // in paisa
      currency: "INR",
      receipt: `receipt_order_${Date.now()}`
    };
    const order = await razorpayInstance.orders.create(options);
    res.json(order);
  } catch(err) {
    console.error(err);
    res.status(500).json({message: 'Payment order creation failed'});
  }
};

exports.confirmOrder = async (req,res) => {
  const { razorpayPaymentId, razorpayOrderId, razorpaySignature, pizzaDetails, totalPrice } = req.body;

  try {
    // Verify signature
    const generatedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(razorpayOrderId + '|' + razorpayPaymentId)
      .digest('hex');
    if(generatedSignature !== razorpaySignature) {
      return res.status(400).json({message: 'Payment signature verification failed'});
    }

    // Create order in DB
    const order = new Order({
      user: req.user._id,
      pizzaDetails,
      totalPrice,
      paymentId: razorpayPaymentId,
      status: 'Order Received'
    });
    await order.save();

    // Update inventory quantities - decrement stock
    const itemsToDecrement = [
      { type: 'base', name: pizzaDetails.base },
      { type: 'sauce', name: pizzaDetails.sauce },
      { type: 'cheese', name: pizzaDetails.cheese }
    ];
    if(pizzaDetails.veggies?.length) {
      pizzaDetails.veggies.forEach(v => itemsToDecrement.push({type:'veggies', name:v}));
    }
    if(pizzaDetails.meat?.length) {
      pizzaDetails.meat.forEach(m => itemsToDecrement.push({type:'meat', name:m}));
    }

    for(const item of itemsToDecrement) {
      await Inventory.findOneAndUpdate(
        { itemType: item.type, itemName: item.name },
        { $inc: { quantity: -1 } },
        { new: true }
      );
    }

    // Check inventory and notify admin if low stock
    await adminEmailNotifyIfLowStock();

    res.json({ message: 'Order placed successfully', order });

    // After order inserted, emit real-time events via socket
    const { io } = require('../server'); // Circular dep - see server.js below
    
    io.of('/admin').emit('newOrder', order);
    io.of('/user').to(req.user._id.toString()).emit('orderStatusUpdated', order);

  } catch(err) {
    console.error(err);
    res.status(500).json({message: err.message});
  }
};

exports.getUserOrders = async (req,res) => {
  try {
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
};