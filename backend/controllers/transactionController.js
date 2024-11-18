"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPieChartData = exports.getBarChartData = exports.getMonthStatistics = exports.listTransactions = exports.initDatabase = void 0;
const transactionService = __importStar(require("../services/transactionService"));
const initDatabase = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield transactionService.initializeDatabase();
        res.status(200).json({ message: 'Database initialized successfully' });
    }
    catch (error) {
        res.status(500).json({ error: 'Error initializing database' });
    }
});
exports.initDatabase = initDatabase;
const listTransactions = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month, search = '', page = 1 } = req.query;
    try {
        const result = yield transactionService.getTransactions(month, search, Number(page));
        res.json(result);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching transactions' });
    }
});
exports.listTransactions = listTransactions;
const getMonthStatistics = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    try {
        const statistics = yield transactionService.getMonthStatistics(month);
        res.json(statistics);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching statistics' });
    }
});
exports.getMonthStatistics = getMonthStatistics;
const getBarChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    try {
        const barChartData = yield transactionService.getBarChartData(month);
        res.json(barChartData);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching bar chart data' });
    }
});
exports.getBarChartData = getBarChartData;
const getPieChartData = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { month } = req.query;
    try {
        const pieChartData = yield transactionService.getPieChartData(month);
        res.json(pieChartData);
    }
    catch (error) {
        res.status(500).json({ error: 'Error fetching pie chart data' });
    }
});
exports.getPieChartData = getPieChartData;
