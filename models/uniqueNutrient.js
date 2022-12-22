"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const uniqueNutrientSchema = new mongoose_1.Schema({
    nutrient: String,
    category: String,
    nutrientId: String,
    unitName: String,
    units: String,
    min: String,
    max: String,
    rank: Number,
    publication_date: String,
    refDatabaseId: String,
    parentNutrient: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UniqueNutrient',
    },
    related_sources: [
        {
            source: String,
            sourceId: String,
            sourceNutrientName: String,
            units: String,
        },
    ],
});
const UniqueNutrient = (0, mongoose_1.model)('UniqueNutrient', uniqueNutrientSchema);
exports.default = UniqueNutrient;
