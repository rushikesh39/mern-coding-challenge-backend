const express = require('express');
const router = express.Router();
const initializeController = require('../controllers/initializeController');
const transactionController = require('../controllers/transactionController');
const statisticController = require('../controllers/statisticController');
const chartController = require('../controllers/chartController');

router.get('/initialize', initializeController.initializeDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', statisticController.getStatistics);
router.get('/barchart', chartController.getBarChartData);
router.get('/piechart', chartController.getPieChartData);

module.exports = router;
