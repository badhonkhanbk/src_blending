"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlanSchema = new mongoose_1.Schema({
    planName: String,
    description: String,
    startDate: Date,
    startDateString: String,
    endDateString: String,
    endDate: Date,
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'Member ID is required'],
    },
    planData: [
        {
            recipes: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: 'RecipeModel' }],
            day: Number,
        },
    ],
    image: {
        url: { type: String, default: '' },
        hash: { type: String, default: '' },
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: Date,
    isGlobal: Boolean,
    numberOfRating: { type: Number, default: 0 },
    totalRating: { type: Number, default: 0 },
    totalViews: { type: Number, default: 0 },
    averageRating: { type: Number, default: 0 },
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    ingredients: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' }],
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
                ref: 'BlendNutrient',
            },
            parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
        },
    ],
    mineral: [
        {
            value: Number,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendNutrient',
            },
            parent: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
        },
    ],
    vitamin: [
        {
            value: Number,
            blendNutrientRefference: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendNutrient',
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
const Plan = (0, mongoose_1.model)('Plan', PlanSchema);
exports.default = Plan;
