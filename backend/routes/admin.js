//This module handles the admin routes for managing inventory and orders.

const router = require('express').Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middlewares/authMiddleware');

router.use(protect, admin);

router.get('/inventory', adminController.getInventory);
router.put('/inventory/:id', adminController.updateInventoryItem);
router.post('/inventory', adminController.addInventoryItem);

router.get('/orders', adminController.getOrders);
router.put('/orders/:orderId/status', adminController.updateOrderStatus);

module.exports = router;