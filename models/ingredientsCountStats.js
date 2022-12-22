"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ingredientCountSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'Member ID is required'],
    },
    date: Date,
    ingredients: [
        {
            ingredientId: mongoose_1.SchemaTypes.ObjectId,
            category: String,
            weightInGram: Number,
        },
    ],
});
const IngredientCount = (0, mongoose_1.model)('IngredientCount', ingredientCountSchema);
exports.default = IngredientCount;
