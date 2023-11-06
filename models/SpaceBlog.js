"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const slugify_1 = __importDefault(require("slugify"));
const SpaceBlogSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: [true, 'title is required'],
    },
    slug: String,
    body: { type: String, default: '' },
    spaceId: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Space',
        required: [true, 'spaceId is required'],
    },
    keywords: { type: [String], default: [] },
    type: String,
    category: String,
    description: String,
    coverImage: String,
    mediaUrl: String,
    mediaLength: Number,
    isPublished: {
        type: Boolean,
        default: false,
    },
    author: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
}, {
    timestamps: true,
});
SpaceBlogSchema.pre('save', async function (next) {
    //@ts-ignore
    this.slug = (0, slugify_1.default)(this.title.toLocaleLowerCase());
    next();
});
const SpaceBlog = (0, mongoose_1.model)('SpaceBlog', SpaceBlogSchema);
exports.default = SpaceBlog;
