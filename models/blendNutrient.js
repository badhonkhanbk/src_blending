"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let allUnits = {
    Kilojoules: { unit: 'kJ', unitName: 'Kilojoules' },
    Gram: { unit: 'G', unitName: 'Gram' },
    Milligram: { unit: 'MG', unitName: 'Milligram' },
    Microgram: { unit: 'UG', unitName: 'Microgram' },
    Kilogram: { unit: 'KG', unitName: 'Kilogram' },
    Millilitre: { unit: 'ML', unitName: 'Millilitre' },
    Ounces: { unit: 'OZ', unitName: 'Ounces' },
};
const blendNutrient = new mongoose_1.Schema({
    blendId: String,
    nutrientName: {
        type: String,
        required: [true, 'nutrient name is required'],
        unique: true,
    },
    altName: { type: String, default: '' },
    category: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrientCategory' },
    status: {
        type: String,
        enum: ['Active', 'Review', 'Archive'],
        default: 'Archive',
    },
    parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrient' },
    uniqueNutrientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UniqueNutrient' },
    parentIsCategory: Boolean,
    rank: Number,
    unitName: String,
    units: String,
    min_measure: String,
    related_sources: [
        {
            source: String,
            sourceId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UniqueNutrient' },
            sourceNutrientName: String,
            units: String,
        },
    ],
    wikiCoverImages: [String],
    wikiFeatureImage: String,
    bodies: [String],
    wikiTitle: String,
    wikiDescription: String,
    seoTitle: String,
    seoSlug: String,
    seoCanonicalURL: String,
    seoSiteMapPriority: Number,
    seoKeywords: [String],
    seoMetaDescription: String,
    createdAt: { type: Date, default: Date.now },
    isPublished: Boolean,
    usePriorityForMap: { type: Boolean, default: false },
    showChildren: { type: Boolean, default: false },
    isBookmarked: { type: Boolean, default: false },
});
blendNutrient.pre('save', async function (next) {
    if (this.unitName !== '' ||
        this.unitName === null ||
        this.unitName === undefined) {
        //@ts-ignore
        this.units = allUnits[this.unitName].unit;
        next();
    }
});
blendNutrient.post('update', async function (next) {
    if (
    //@ts-ignore
    this.unitName !== '' ||
        //@ts-ignore
        this.unitName === null ||
        //@ts-ignore
        this.unitName === undefined) {
        //@ts-ignore
        this.units = allUnits[this.unitName].unit;
        next();
    }
});
const BlendNutrient = (0, mongoose_1.model)('BlendNutrient', blendNutrient);
exports.default = BlendNutrient;
// https://ods.od.nih.gov/HealthInformation/nutrientrecommendations.aspx#:~:text=DRI%20is%20the%20general%20term,%25%2D98%25
//https://www.ncbi.nlm.nih.gov/books/NBK545442/table/appJ_tab9/?report=objectonly
