"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const QANotFoundIngredient = new mongoose_1.Schema({
    name: String,
    quantity: Number,
    unit: String,
    comment: String,
    userIngredient: String,
    status: String,
    action: { type: String, default: 'New' },
    issues: [String],
    bestMatchCounts: { type: Number, default: 0 },
    sourceIngredients: [
        {
            ingredientId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Ingredient',
            },
            percentage: Number,
        },
    ],
    blendIngredients: [
        {
            ingredientId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'BlendIngredient',
            },
            percentage: Number,
        },
    ],
    bestMatch: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'BlendIngredient',
    },
    matchedIngredients: [
        {
            ingredientId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                refPath: 'matchedIngredients.onModel',
            },
            onModel: {
                type: String,
                required: true,
                enum: ['BlendIngredient', 'Ingredient'],
            },
            percentage: Number,
        },
    ],
    versions: [[{ type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' }]],
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
    errorParsed: { type: Boolean, default: false },
});
QANotFoundIngredient.pre('save', async function (next) {
    //@ts-ignore
    this.bestMatchCounts =
        this.sourceIngredients.length + this.blendIngredients.length;
    for (let i = 0; i < this.sourceIngredients.length; i++) {
        this.matchedIngredients.push({
            ingredientId: this.sourceIngredients[i].ingredientId,
            onModel: 'Ingredient',
            percentage: this.sourceIngredients[i].percentage,
        });
    }
    for (let i = 0; i < this.blendIngredients.length; i++) {
        this.matchedIngredients.push({
            ingredientId: this.blendIngredients[i].ingredientId,
            onModel: 'BlendIngredient',
            percentage: this.blendIngredients[i].percentage,
        });
    }
    next();
});
const QANotFoundIngredientModel = (0, mongoose_1.model)('QANotFoundIngredient', QANotFoundIngredient);
exports.default = QANotFoundIngredientModel;
