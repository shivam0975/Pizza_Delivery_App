//This modules helps fetch all pizza variety

const router = require('express').Router();
const { protect } = require('../middlewares/authMiddleware');
const pizzaController = require('../controllers/pizzaController');

router.get('/varieties', protect, pizzaController.getPizzaVarieties);
router.get('/inventory', protect, pizzaController.getInventory);

module.exports = router;