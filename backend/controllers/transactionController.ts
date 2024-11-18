import { Request, Response } from 'express';
import * as transactionService from '../services/transactionService';

export const initDatabase = async (req: Request, res: Response) => {
  try {
    await transactionService.initializeDatabase();
    res.status(200).json({ message: 'Database initialized successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Error initializing database' });
  }
};

export const listTransactions = async (req: Request, res: Response) => {
  const { month, search = '', page = 1 } = req.query;
  try {
    const result = await transactionService.getTransactions(
      month as string, 
      search as string, 
      Number(page)
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching transactions' });
  }
};

export const getMonthStatistics = async (req: Request, res: Response) => {
  const { month } = req.query;
  try {
    const statistics = await transactionService.getMonthStatistics(month as string);
    res.json(statistics);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching statistics' });
  }
};

export const getBarChartData = async (req: Request, res: Response) => {
  const { month } = req.query;
  try {
    const barChartData = await transactionService.getBarChartData(month as string);
    res.json(barChartData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching bar chart data' });
  }
};

export const getPieChartData = async (req: Request, res: Response) => {
  const { month } = req.query;
  try {
    const pieChartData = await transactionService.getPieChartData(month as string);
    res.json(pieChartData);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching pie chart data' });
  }
};