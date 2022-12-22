"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareSchema = new mongoose_1.Schema({
    sharedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'MemberId is required'],
    },
    shareTo: [
        {
            email: String,
            hasAccepted: Boolean,
        },
    ],
    shareData: [
        {
            data: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'recipe' },
        },
    ],
    type: {
        type: String,
        enum: ['recipe', 'collection'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    collectionId: { type: String, ref: 'UserCollection' },
    all: Boolean,
});
const share = (0, mongoose_1.model)('share', shareSchema);
exports.default = share;
