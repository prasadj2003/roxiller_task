import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const getCombinedData = async (req: Request, res: Response) => {
    try {
      const { month = 'January' } = req.query;
      const [transactions, statistics, barChart, pieChart] = await Promise.all([
        transactionService.getTransactions(month as string, '', 1),
        transactionService.getMonthStatistics(month as string),
        transactionService.getBarChartData(month as string),
        transactionService.getPieChartData(month as string)
      ]);
  
      res.json({
        transactions,
        statistics,
        barChart,
        pieChart
      });
    } catch (error: any) {
      console.error('Error in getCombinedData:', error);
      res.status(500).json({ 
        error: 'Failed to fetch combined data', 
        details: error.message 
      });
    }
};