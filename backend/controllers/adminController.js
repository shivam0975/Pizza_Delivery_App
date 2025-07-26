//This module handles creation , listing updations of ingredients and other admin retaled operations

const Inventory = require('../models/Inventory');
const Order = require('../models/Order');

exports.addInventoryItem = async (req, res) => {
  try {
    const { itemType, itemName, quantity,price } = req.body;

    if (!itemType || !itemName || quantity == null || price == null) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const existingItem = await Inventory.findOne({ itemType, itemName });
    if (existingItem) {
      return res.status(400).json({ message: "Item already exists in inventory" });
    }

    const newItem = new Inventory({
      itemType,
      itemName,
      quantity,
      price
    });

    await newItem.save();

    res.status(201).json({ message: "Inventory item added successfully", item: newItem });
  } catch (error) {
    console.error("Error adding inventory item:", error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getInventory = async (req,res) => {
  try {
    const items = await Inventory.find();
    const grouped = items.reduce((acc, item) => {
      if(!acc[item.itemType]) acc[item.itemType] = [];
      acc[item.itemType].push(item);
      return acc;
    }, {});
    res.json(grouped);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
};

exports.updateInventoryItem = async (req,res) => {
  try {
    const { id } = req.params;
    const { quantity } = req.body;
    const item = await Inventory.findByIdAndUpdate(id, { quantity }, { new:true });
    res.json(item);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getOrders = async (req,res) => {
  const orders = await Order.find({}).populate('user','name email');
  res.json(orders);
};

exports.updateOrderStatus = async (req,res) => {
  const { orderId } = req.params;
  const { status } = req.body;
  try {
    const order = await Order.findById(orderId);
    if(!order) return res.status(404).json({message:'Order not found'});
    order.status = status;
    await order.save();

    const { io } = require('../server');
    io.of('/user').to(order.user.toString()).emit('orderStatusUpdated', order);

    res.json(order);
  } catch(err) {
    res.status(500).json({ message: err.message });
  }
};