const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const dashboardController = require('../controllers/dashboardController');
const unitController = require('../controllers/unitController');

// Tambahkan di bawah route yang sudah ada
router.get('/units', unitController.getAllUnits);
router.post('/units', unitController.addUnit);

// Auth Route
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/logout', authController.logout);

// Dashboard Route
router.get('/dashboard', dashboardController.getStats);

module.exports = router;