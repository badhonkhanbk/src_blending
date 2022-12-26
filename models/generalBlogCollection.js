"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const blogCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    slug: String,
    description: {
        type: String,
        default: '',
    },
    image: String,
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
    },
    blogs: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'GeneraBlog',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    collectionDataCount: {
        type: Number,
        default: 0,
    },
    updatedAt: { type: Date, default: Date.now },
});
const BlogCollection = (0, mongoose_1.model)('BlogCollection', blogCollectionSchema);
exports.default = BlogCollection;
