//This module handles the logic to manage present pizza varities and fetching to frontend display

const PizzaVariety = require('../models/PizzaVariety');
const Inventory = require('../models/Inventory');

exports.getPizzaVarieties = async (req,res) => {
  try {
    const pizzas = await PizzaVariety.find({});
    res.json(pizzas);
  } catch(err) {
    res.status(500).json({message: err.message});
  }
};

exports.getInventory = async (req,res) => {
  try {
    const items = await Inventory.find({});

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