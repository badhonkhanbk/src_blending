"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planCommentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'comment name is required'],
    },
    planId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Plan' },
    memberId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const planComment = (0, mongoose_1.model)('planComment', planCommentSchema);
exports.default = planComment;
