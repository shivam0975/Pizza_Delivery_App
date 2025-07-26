//This module routes for login register forget , reset verification etc

const router = require('express').Router();
const authController = require('../controllers/authController');
const {protect} = require('../middlewares/authMiddleware');

// Register
router.post('/register', authController.register);
// Verify email token
router.get('/verify-email/:token', authController.verifyEmail);
// Login
router.post('/login', authController.login);
// Forgot Password
router.post('/forgot-password', authController.forgotPassword);
// Reset Password
router.post('/reset-password/:token', authController.resetPassword);
// Get Current User
router.get('/me', protect, authController.getMe);
//Logout
router.post('/logout', protect, authController.logout);

module.exports = router;