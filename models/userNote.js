"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userNoteSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'name is required'],
    },
    body: String,
    recipeId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'Recipe' },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date,
});
const UserNote = (0, mongoose_1.model)('UserNote', userNoteSchema);
exports.default = UserNote;
