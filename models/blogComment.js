"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogCommentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'comment name is required'],
    },
    blogId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'GeneraBlog' },
    memberId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const blogComment = (0, mongoose_1.model)('blogComment', blogCommentSchema);
exports.default = blogComment;
