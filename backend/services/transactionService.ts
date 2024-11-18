import axios from 'axios';
import Transaction from '../models/Transaction';
import { getPriceRange } from '../utils/priceRangeUtil';

export const initializeDatabase = async () => {
  const response = await axios.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
  await Transaction.deleteMany({});
  await Transaction.insertMany(response.data);
};

export const getTransactions = async (month: string, search: string, page: number) => {
    try {
      const pageSize = 10;
      const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
  
      const query: any = { 
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] } 
      };
  
      // Enhance search logic
      if (search) {
        query.$or = [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { price: !isNaN(Number(search)) ? Number(search) : undefined }
        ].filter(condition => condition !== undefined);
      }
  
      const transactions = await Transaction.find(query)
        .skip((page - 1) * pageSize)
        .limit(pageSize);
  
      const total = await Transaction.countDocuments(query);
  
      return { 
        transactions, 
        total, 
        page, 
        pageSize,
        monthNumber 
      };
    } catch (error: any) {
      console.error('Error in getTransactions:', error);
      throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
  };

export const getMonthStatistics = async (month: string) => {
  const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
  const result = await Transaction.aggregate([
    { 
      $match: { 
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] } 
      } 
    },
    {
      $group: {
        _id: null,
        totalSaleAmount: { $sum: { $cond: ['$sold', '$price', 0] } },
        totalSoldItems: { $sum: { $cond: ['$sold', 1, 0] } },
        totalNotSoldItems: { $sum: { $cond: ['$sold', 0, 1] } }
      }
    }
  ]);

  return result[0];
};

export const getBarChartData = async (month: string) => {
    try {
      const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
  
      const result = await Transaction.aggregate([
        { 
          $match: { 
            $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] } 
          } 
        },
        {
          $project: {
            priceRange: {
              $switch: {
                branches: [
                  { case: { $and: [ { $gte: ['$price', 0] }, { $lte: ['$price', 100] } ] }, then: '0 - 100' },
                  { case: { $and: [ { $gte: ['$price', 101] }, { $lte: ['$price', 200] } ] }, then: '101 - 200' },
                  { case: { $and: [ { $gte: ['$price', 201] }, { $lte: ['$price', 300] } ] }, then: '201 - 300' },
                  { case: { $and: [ { $gte: ['$price', 301] }, { $lte: ['$price', 400] } ] }, then: '301 - 400' },
                  { case: { $and: [ { $gte: ['$price', 401] }, { $lte: ['$price', 500] } ] }, then: '401 - 500' },
                  { case: { $and: [ { $gte: ['$price', 501] }, { $lte: ['$price', 600] } ] }, then: '501 - 600' },
                  { case: { $and: [ { $gte: ['$price', 601] }, { $lte: ['$price', 700] } ] }, then: '601 - 700' },
                  { case: { $and: [ { $gte: ['$price', 701] }, { $lte: ['$price', 800] } ] }, then: '701 - 800' },
                  { case: { $and: [ { $gte: ['$price', 801] }, { $lte: ['$price', 900] } ] }, then: '801 - 900' }
                ],
                default: '901 - above'
              }
            }
          }
        },
        {
          $group: {
            _id: '$priceRange',
            count: { $sum: 1 }
          }
        },
        {
          $sort: { count: -1 }
        }
      ]);
  
      return result;
    } catch (error: any) {
      console.error('Error in getBarChartData:', error);
      throw new Error(`Failed to fetch bar chart data: ${error.message}`);
    }
  };
  

export const getPieChartData = async (month: string) => {
  const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
  const result = await Transaction.aggregate([
    { 
      $match: { 
        $expr: { $eq: [{ $month: '$dateOfSale' }, monthNumber] } 
      } 
    },
    {
      $group: {
        _id: '$category',
        count: { $sum: 1 }
      }
    }
  ]);

  return result;
};