const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const unitController = require('../controllers/unitController');

// Middleware Proteksi API
const isAuthenticated = (req, res, next) => {
    if (req.session.userId) return next();
    res.status(401).json({ message: "Unauthorized: Silakan login kembali" });
};

// Route Unit (Sekarang diproteksi)
router.get('/units', isAuthenticated, unitController.getAllUnits);
router.post('/units', isAuthenticated, unitController.addUnit);

// Auth Route
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Dashboard Route
router.get('/dashboard', isAuthenticated, dashboardController.getStats);

module.exports = router;