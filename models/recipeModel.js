"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recipeModelSchema = new mongoose_1.Schema({
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
    brand: { type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeBrand' },
    foodCategories: [String],
    //NOTE:
    recipeInstructions: [String],
    servingSize: {
        // version
        type: Number,
        default: 0,
    },
    ingredients: [
        //version
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
    userId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'User',
    },
    adminIds: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Admin',
        },
    ],
    adminId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Admin',
    },
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
    commentsCount: { type: Number, default: 0 },
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    originalVersion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RecipeVersion',
    },
    turnedOnVersions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'RecipeVersion',
        },
    ],
    turnedOffVersions: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'RecipeVersion',
        },
    ],
    defaultVersion: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'RecipeVersion',
    },
    createdAt: { type: Date, default: Date.now },
    editedAt: Date,
    isMatch: { type: Boolean, default: true },
});
const RecipeModel = (0, mongoose_1.model)('RecipeModel', recipeModelSchema);
exports.default = RecipeModel;
