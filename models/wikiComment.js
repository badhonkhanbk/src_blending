"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const wikiCommentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'comment name is required'],
    },
    type: {
        type: String,
        enum: ['Ingredient', 'Nutrient', 'Health'],
        default: 'user',
    },
    entityId: { type: mongoose_1.SchemaTypes.ObjectId },
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const UserWikiComment = (0, mongoose_1.model)('WikiComment', wikiCommentSchema);
exports.default = UserWikiComment;
