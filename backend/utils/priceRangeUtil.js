"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPriceRange = void 0;
const getPriceRange = (price) => {
    const ranges = [
        { min: 0, max: 100, label: '0 - 100' },
        { min: 101, max: 200, label: '101 - 200' },
        { min: 201, max: 300, label: '201 - 300' },
        { min: 301, max: 400, label: '301 - 400' },
        { min: 401, max: 500, label: '401 - 500' },
        { min: 501, max: 600, label: '501 - 600' },
        { min: 601, max: 700, label: '601 - 700' },
        { min: 701, max: 800, label: '701 - 800' },
        { min: 801, max: 900, label: '801 - 900' }
    ];
    const range = ranges.find(r => price >= r.min && price <= r.max);
    return range ? range.label : '901 - above';
};
exports.getPriceRange = getPriceRange;
