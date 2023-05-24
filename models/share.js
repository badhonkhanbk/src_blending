"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareSchema = new mongoose_1.Schema({
    sharedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'MemberId is required'],
    },
    shareTo: [
        {
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: Boolean,
        },
    ],
    shareData: {
        recipeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'RecipeModel' },
        version: {
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'recipeVersion',
        },
        turnedOnVersions: [
            {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'recipeVersion',
            },
        ],
        turnedOnCount: {
            type: Number,
            default: 0,
        },
    },
    globalAccepted: [
        {
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        },
    ],
    globalRejected: [
        {
            type: mongoose_1.SchemaTypes.ObjectId,
            ref: 'User',
        },
    ],
    isGlobal: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    notFoundEmails: [String],
});
shareSchema.pre('save', async function (next) {
    //@ts-ignore
    if (this.shareData.turnedOnVersions.length > 0) {
        //@ts-ignore
        this.shareData.turnedOnCount = this.shareData.turnedOnVersions.length;
    }
    next();
});
const share = (0, mongoose_1.model)('share', shareSchema);
exports.default = share;
