"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeFactSchema = new mongoose_1.Schema({
    recipeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' },
    versionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' },
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
const RecipeFact = (0, mongoose_1.model)('RecipeFact', recipeFactSchema);
exports.default = RecipeFact;
