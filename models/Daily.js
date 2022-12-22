"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DailySchema = new mongoose_1.Schema({
    nutrientName: String,
    categoryName: String,
    category: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'BlendNutrientCategory' },
    units: String,
    unitName: String,
    blendNutrientRef: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'BlendNutrient',
    },
    showPercentage: {
        type: Boolean,
        default: false,
    },
    percentage: Number,
    calorieGram: Number,
    ranges: [
        {
            lifeStageGroup: {
                type: String,
                enum: [
                    'infants',
                    'children',
                    'adults',
                    'males',
                    'females',
                    'pregnancy',
                    'lactation',
                ],
            },
            ageInRange: Boolean,
            ageInMonth: Boolean,
            dailyPercentage: Boolean,
            dailyPercentageInRange: Boolean,
            ageRangeFrom: Number,
            ageRangeTo: Number,
            ageMorethan: Number,
            ageLessThan: Number,
            dailyPercentageRangeFrom: Number,
            dailyPercentageRangeTo: Number,
            dailyPercentageValue: Number,
            value: Number,
            units: String,
            RDA: Boolean,
            upperLimit: Number,
        },
    ],
});
const UserDaily = (0, mongoose_1.model)('userDaily', DailySchema);
exports.default = UserDaily;
