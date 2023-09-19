"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
// srcFoodReference blendNutrients notBlendNutrients collections varrient bodies
const blendIngredientSchema = new mongoose_1.Schema({
    ingredientName: String,
    aliases: [String],
    category: String,
    blendStatus: { type: String, default: 'New' },
    classType: String,
    description: String,
    srcFoodReference: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Ingredient' },
    blendNutrients: {
        type: [
            {
                value2: { type: String, default: '0' },
                value: String,
                valueInNumber: Number,
                link: { type: String, default: null },
                disabled: { type: Boolean, default: false },
                // originalIngredientName: {
                //   type: String,
                //   default: '',
                // },
                blendNutrientRefference: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'BlendNutrient',
                },
                uniqueNutrientReferrence: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: 'UniqueNutrient',
                },
            },
        ],
        index: true,
    },
    nutrientCount: Number,
    notBlendNutrients: [
        {
            value: String,
            sourceId: String,
            uniqueNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'UniqueNutrient',
            },
        },
    ],
    portions: [
        {
            measurement: String,
            measurement2: String,
            meausermentWeight: String,
            default: { type: Boolean, default: false },
            sourceId: String,
        },
    ],
    featuredImage: String,
    images: [String],
    imageCount: Number,
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    varrient: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
    gi: {
        type: Number,
        default: 55,
    },
    gl: {
        type: Number,
        default: 0,
    },
    netCarbs: {
        type: Number,
        default: 0,
    },
    wikiCoverImages: [String],
    wikiFeatureImage: String,
    wikiTitle: String,
    wikiDescription: String,
    bodies: [String],
    createdAt: { type: Date, default: Date.now },
    modifiedAt: { type: Date, default: Date.now },
    seoTitle: String,
    seoSlug: String,
    seoCanonicalURL: String,
    seoSiteMapPriority: Number,
    seoKeywords: [String],
    seoMetaDescription: String,
    sourceName: { type: String, default: 'Blending101' },
    isPublished: Boolean,
    isBookmarked: { type: Boolean, default: false },
    rxScore: { type: Number, default: 0 },
});
blendIngredientSchema.pre('save', async function (next) {
    //@ts-ignore
    this.nutrientCount = this.blendNutrients.length;
    next();
});
blendIngredientSchema.pre('save', async function (next) {
    //@ts-ignore
    this.imageCount = this.images.length;
    next();
});
// blendIngredientSchema.pre('find', async function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
const BlendIngredient = (0, mongoose_1.model)('BlendIngredient', blendIngredientSchema);
// blendIngredientSchema.pre('save', async function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
// blendIngredientSchema.pre('find', function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
exports.default = BlendIngredient;
