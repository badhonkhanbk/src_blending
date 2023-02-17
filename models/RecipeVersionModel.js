"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeVersionSchema = new mongoose_1.Schema({
    recipeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe', required: true },
    postfixTitle: { type: String, default: '' },
    description: { type: String, default: '' },
    recipeInstructions: [String],
    servingSize: {
        type: Number,
        default: 0,
    },
    ingredients: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
            selectedPortion: { name: String, quantity: Number, gram: Number },
            weightInGram: Number,
            portions: [
                { name: String, quantiy: Number, default: Boolean, gram: Number },
            ],
        },
    ],
    isDefault: { type: Boolean, default: false },
    isOriginal: { type: Boolean, default: false },
    editedAt: Date,
    createdAt: { type: Date, default: Date.now },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
});
const RecipeVersion = (0, mongoose_1.model)('RecipeVersion', recipeVersionSchema);
exports.default = RecipeVersion;
//working
