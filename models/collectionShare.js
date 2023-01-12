"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareCollectionSchema = new mongoose_1.Schema({
    sharedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'MemberId is required'],
    },
    shareTo: [
        {
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Member',
            },
            hasAccepted: Boolean,
        },
    ],
    collectionId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'UserCollection',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const shareCollection = (0, mongoose_1.model)('shareCollection', shareCollectionSchema);
exports.default = shareCollection;
