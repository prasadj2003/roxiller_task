import express from 'express';
import * as transactionController from '../controllers/transactionController';
import * as combinedController from '../controllers/combinedController';

const router = express.Router();

router.get('/initialize', transactionController.initDatabase);
router.get('/transactions', transactionController.listTransactions);
router.get('/statistics', transactionController.getMonthStatistics);
router.get('/bar-chart', transactionController.getBarChartData);
router.get('/pie-chart', transactionController.getPieChartData);
router.get('/combined-data', combinedController.getCombinedData);

export default router;