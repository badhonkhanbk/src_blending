"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ThemeSchema = new mongoose_1.Schema({
    themeName: {
        type: String,
        required: true,
    },
    description: String,
    channel: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'ThemeChannel' },
    link: String,
    thumbnailImage: String,
    viewPorts: [String],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});
const Theme = (0, mongoose_1.model)('Theme', ThemeSchema);
exports.default = Theme;
