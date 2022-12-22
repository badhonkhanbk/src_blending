"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function unitConversion(value, fromUnit, toUnit) {
    if (fromUnit === 'Kilojoules' && toUnit === 'Grams') {
        return value * 238.90295761862;
    }
    else if (fromUnit === 'Kilojoules' && toUnit === 'Milligram') {
        return value * 238902.95761862;
    }
    else if (fromUnit === 'Kilojoules' && toUnit === '') {
    }
}
exports.default = unitConversion;
