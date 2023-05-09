"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const commentSchema = new mongoose_1.Schema({
    comment: {
        type: String,
        required: [true, 'comment name is required'],
    },
    // rating: {
    //   type: Number,
    //   min: 1,
    //   max: 5,
    //   default: 0,
    // },
    recipeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Recipe' },
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const UserComment = (0, mongoose_1.model)('userComment', commentSchema);
exports.default = UserComment;
