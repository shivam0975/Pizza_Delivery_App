//This module noptifies the admin via mail when stocks are low.

const Inventory = require('../models/Inventory');
const { sendEmail } = require('./sendEmail');

const lowStockItemsPreviouslyNotified = new Set();

exports.adminEmailNotifyIfLowStock = async () => {
  const threshold = Number(process.env.LOW_STOCK_THRESHOLD) || 20;
  const adminEmail = process.env.ADMIN_EMAIL;

  const lowStockItems = await Inventory.find({ quantity: { $lt: threshold } });

  for(const item of lowStockItems){
    if(!lowStockItemsPreviouslyNotified.has(item._id.toString())){
      await sendEmail({
        to: adminEmail,
        subject: `Low stock Alert: ${item.itemName}`,
        html: `<p>The inventory for ${item.itemName} (${item.itemType}) is below threshold (${item.quantity})</p>`
      });
      lowStockItemsPreviouslyNotified.add(item._id.toString());
    }
  }

  const allItems = await Inventory.find({});
  allItems.forEach(item => {
    if(item.quantity >= threshold && lowStockItemsPreviouslyNotified.has(item._id.toString())) {
      lowStockItemsPreviouslyNotified.delete(item._id.toString());
    }
  });
};