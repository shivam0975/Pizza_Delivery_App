//This module represents inventory iterms like bases, sauces, cheeses, etc. in the database.

const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  itemType: { type: String, enum:['base','sauce','cheese','veggies','meat'], required:true },
  itemName: { type: String, required:true },
  quantity: { type: Number, required:true, default:0 },
  price: { type: Number, required:true, default:100 },
}, { timestamps:true });

module.exports = mongoose.model('Inventory', inventorySchema);