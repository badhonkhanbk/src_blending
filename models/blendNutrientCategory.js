"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blendNutrientCategory = new mongoose_1.Schema({
    blendId: String,
    categoryName: {
        type: String,
        required: [true, 'category name is required'],
        unique: true,
    },
    slug: String,
    nutrientDescription: String,
    images: [String],
    featuredImage: String,
    keywords: [String],
    isPublished: Boolean,
    rank: Number,
    count: Number,
});
const BlendNutrientCategory = (0, mongoose_1.model)('BlendNutrientCategory', blendNutrientCategory);
exports.default = BlendNutrientCategory;
