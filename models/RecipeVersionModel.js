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
    selectedImage: String,
    // isDefault: { type: Boolean, default: false },
    // isOriginal: { type: Boolean, default: false },
    errorIngredients: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
            qaId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'QANotFoundIngredient' },
            errorString: String,
        },
    ],
    editedAt: Date,
    createdAt: { type: Date, default: Date.now },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    calorie: {
        value: Number,
        blendNutrientRefference: {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'BlendNutrient',
        },
        parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
    },
    energy: [
        {
            value: Number,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendIngredient',
            },
            parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
        },
    ],
    mineral: [
        {
            value: Number,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendIngredient',
            },
            parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
        },
    ],
    vitamin: [
        {
            value: Number,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendIngredient',
            },
            parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
        },
    ],
    gigl: {
        totalGi: Number,
        netCarbs: Number,
        totalGL: Number,
    },
});
const RecipeVersion = (0, mongoose_1.model)('RecipeVersion', recipeVersionSchema);
exports.default = RecipeVersion;
//working
