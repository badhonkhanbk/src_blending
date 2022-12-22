"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ThemeChannelSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    description: String,
    createdAt: { type: Date, default: Date.now() },
});
const ThemeChannel = (0, mongoose_1.model)('ThemeChannel', ThemeChannelSchema);
exports.default = ThemeChannel;
