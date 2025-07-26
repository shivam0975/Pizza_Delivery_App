//This module routets to place view or manage orders

const router = require('express').Router();
const orderController = require('../controllers/orderController');
const { protect } = require('../middlewares/authMiddleware');

router.post('/create-order', protect, orderController.createOrder);
router.post('/confirm', protect, orderController.confirmOrder);
router.get('/user-orders', protect, orderController.getUserOrders);

module.exports = router;