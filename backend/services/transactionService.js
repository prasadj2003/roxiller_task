"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPieChartData = exports.getBarChartData = exports.getMonthStatistics = exports.getTransactions = exports.initializeDatabase = void 0;
const axios_1 = __importDefault(require("axios"));
const Transaction_1 = __importDefault(require("../models/Transaction"));
const initializeDatabase = () => __awaiter(void 0, void 0, void 0, function* () {
    const response = yield axios_1.default.get('https://s3.amazonaws.com/roxiler.com/product_transaction.json');
    yield Transaction_1.default.deleteMany({});
    yield Transaction_1.default.insertMany(response.data);
});
exports.initializeDatabase = initializeDatabase;
const getTransactions = (month, search, page) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const pageSize = 10;
        const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
        const query = {
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
        const transactions = yield Transaction_1.default.find(query)
            .skip((page - 1) * pageSize)
            .limit(pageSize);
        const total = yield Transaction_1.default.countDocuments(query);
        return {
            transactions,
            total,
            page,
            pageSize,
            monthNumber
        };
    }
    catch (error) {
        console.error('Error in getTransactions:', error);
        throw new Error(`Failed to fetch transactions: ${error.message}`);
    }
});
exports.getTransactions = getTransactions;
const getMonthStatistics = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
    const result = yield Transaction_1.default.aggregate([
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
});
exports.getMonthStatistics = getMonthStatistics;
const getBarChartData = (month) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
        const result = yield Transaction_1.default.aggregate([
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
                                { case: { $and: [{ $gte: ['$price', 0] }, { $lte: ['$price', 100] }] }, then: '0 - 100' },
                                { case: { $and: [{ $gte: ['$price', 101] }, { $lte: ['$price', 200] }] }, then: '101 - 200' },
                                { case: { $and: [{ $gte: ['$price', 201] }, { $lte: ['$price', 300] }] }, then: '201 - 300' },
                                { case: { $and: [{ $gte: ['$price', 301] }, { $lte: ['$price', 400] }] }, then: '301 - 400' },
                                { case: { $and: [{ $gte: ['$price', 401] }, { $lte: ['$price', 500] }] }, then: '401 - 500' },
                                { case: { $and: [{ $gte: ['$price', 501] }, { $lte: ['$price', 600] }] }, then: '501 - 600' },
                                { case: { $and: [{ $gte: ['$price', 601] }, { $lte: ['$price', 700] }] }, then: '601 - 700' },
                                { case: { $and: [{ $gte: ['$price', 701] }, { $lte: ['$price', 800] }] }, then: '701 - 800' },
                                { case: { $and: [{ $gte: ['$price', 801] }, { $lte: ['$price', 900] }] }, then: '801 - 900' }
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
    }
    catch (error) {
        console.error('Error in getBarChartData:', error);
        throw new Error(`Failed to fetch bar chart data: ${error.message}`);
    }
});
exports.getBarChartData = getBarChartData;
const getPieChartData = (month) => __awaiter(void 0, void 0, void 0, function* () {
    const monthNumber = new Date(`${month} 1, 2023`).getMonth() + 1;
    const result = yield Transaction_1.default.aggregate([
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
});
exports.getPieChartData = getPieChartData;
