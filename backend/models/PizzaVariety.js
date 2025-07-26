//This module defines the schema for pizza varieties in the database.

const mongoose = require('mongoose');

const pizzaVarietySchema = new mongoose.Schema({
  name: { type: String, required:true },
  description: String,
  price: Number,
  base: String,
  sauce: String,
  cheese: String,
  veggies: [String],
  meat: [String]
}, { timestamps:true });

module.exports = mongoose.model('PizzaVariety', pizzaVarietySchema);