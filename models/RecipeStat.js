"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeStatSchema = new mongoose_1.Schema({
    recipeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' },
    originalVersion: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' },
    shareCount: {
        type: Number,
        default: 0,
    },
    viewCount: {
        type: Number,
        default: 0,
    },
    image: [{ image: String, default: Boolean }],
    servings: {
        type: Number,
        default: 1,
    },
    versions: [
        {
            versionId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' },
            createdBy: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'User',
            },
            timeCreated: Date
        },
    ],
});
const RecipeStat = (0, mongoose_1.model)('RecipeStat', recipeStatSchema);
exports.default = RecipeStat;
