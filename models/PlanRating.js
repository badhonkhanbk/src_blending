"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let min = [
    1,
    'The value of path `{PATH}` ({VALUE}) is beneath the limit ({MIN}).',
];
let max = [
    5,
    'The value of path `{PATH}` ({VALUE}) exceeds the limit ({MAX}).',
];
const PlanRatingSchema = new mongoose_1.Schema({
    rating: {
        type: Number,
        min: min,
        max: max,
        required: [true, 'Rating is Required'],
    },
    planId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Plan',
        required: [true, 'planId is required'],
    },
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'MemberId is required'],
    },
}, {
    timestamps: true,
});
const PlanRating = (0, mongoose_1.model)('PlanRating', PlanRatingSchema);
exports.default = PlanRating;
