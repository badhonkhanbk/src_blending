"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// srcFoodReference blendNutrients notBlendNutrients collections varrient bodies
const wikiSchema = new mongoose_1.Schema({
    _id: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true,
    },
    onModel: {
        type: String,
        required: true,
        enum: ['BlendIngredient', 'BlendNutrient'],
    },
    type: String,
    wikiCoverImages: [String],
    wikiFeatureImage: String,
    wikiTitle: String,
    wikiDescription: String,
    bodies: { type: String, default: '' },
    createdAt: { type: Date, default: Date.now },
    modifiedAt: Date,
    seoTitle: String,
    seoSlug: String,
    seoCanonicalURL: String,
    seoSiteMapPriority: Number,
    seoKeywords: [String],
    seoMetaDescription: String,
    sourceName: String,
    isPublished: { type: Boolean, default: false },
    publishDate: Date,
    publishedBy: String,
    isBookmarked: { type: Boolean, default: false },
    collections: {
        type: [
            {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'AdminCollection',
            },
        ],
        default: [],
    },
    nutrientBookmarkList: [
        {
            nutrientId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendNutrient',
            },
            customBookmarkName: String,
            link: { type: String, default: '' },
            active: { type: mongoose_1.Schema.Types.Boolean, default: false },
        },
    ],
    ingredientBookmarkList: [
        {
            ingredientId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendIngredient',
            },
            customBookmarkName: String,
            link: { type: String, default: '' },
            active: { type: mongoose_1.Schema.Types.Boolean, default: false },
        },
    ],
});
const Wiki = (0, mongoose_1.model)('Wiki', wikiSchema);
exports.default = Wiki;
