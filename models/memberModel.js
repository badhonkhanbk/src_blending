"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memberSchema = new mongoose_1.Schema({
    image: String,
    bio: String,
    provider: {
        type: String,
        enum: ['email', 'google', 'facebook'],
        default: 'email',
    },
    firstName: String,
    lastName: String,
    displayName: String,
    yourBlender: String,
    blenderManufacturer: { type: String, default: '' },
    email: {
        type: String,
        required: [true, 'email is required'],
        unique: true,
    },
    phone: String,
    location: String,
    orderHistoty: [String],
    myCart: [String],
    recentViewedProducts: [String],
    createdAt: { type: Date, default: Date.now },
    configuration: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'MemberConfiguiration',
    },
    defaultCollection: { type: mongoose_1.Schema.Types.ObjectId, ref: 'UserCollection' },
    lastModifiedCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'UserCollection',
    },
    collections: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'UserCollection' }],
    dailyGoal: { type: mongoose_1.Schema.Types.ObjectId, ref: 'dailyGoal' },
    compareList: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'RecipeModel' }],
    compareLength: {
        type: Number,
        default: 0,
    },
    macroInfo: [
        {
            blendNutrientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendNutrient' },
            percentage: Number,
        },
    ],
    wikiCompareCount: { type: Number, default: 0 },
    isCreated: Boolean,
    defaultChallengeId: { type: String, ref: 'challenge' },
    lastModifiedBlogCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'BlogCollection',
    },
    lastModifiedPlanCollection: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'PlanCollection',
    },
    facilitatorsAccess: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Space',
        },
    ],
});
const Member = (0, mongoose_1.model)('User', memberSchema);
exports.default = Member;
