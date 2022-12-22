"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const scrappedRecipeSchema = new mongoose_1.Schema({
    mainEntityOfPage: String,
    name: String,
    image: [{ image: String, default: Boolean }],
    servings: {
        type: Number,
        default: 1,
    },
    datePublished: String,
    description: String,
    prepTime: String,
    cookTime: String,
    totalTime: String,
    recipeYield: String,
    recipeCuisines: [String],
    author: [String],
    recipeBlendCategory: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeCategory' },
    tempBlendCategory: String,
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeBrand' },
    foodCategories: [String],
    //NOTE:
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
    //NOTE:
    isPublished: {
        type: Boolean,
        default: false,
    },
    url: String,
    favicon: String,
    // blendStatus:
    addedByAdmin: {
        type: Boolean,
        default: false,
    },
    userId: String,
    adminIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    ],
    discovery: {
        type: Boolean,
        default: false,
    },
    global: { type: Boolean, default: false },
    numberOfRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    seoTitle: String,
    seoSlug: String,
    seoCanonicalURL: String,
    seoSiteMapPriority: Number,
    seoKeywords: [String],
    seoMetaDescription: String,
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    recipeVersion: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' }],
    createdAt: { type: Date, default: Date.now },
    originalVersion: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' },
    defaultVersion: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeVersion' },
    editedAt: Date,
    isMatch: { type: Boolean, default: true },
    isBulk: { type: Boolean, default: false },
});
const ScrappedRecipe = (0, mongoose_1.model)('ScrappedRecipe', scrappedRecipeSchema);
exports.default = ScrappedRecipe;
