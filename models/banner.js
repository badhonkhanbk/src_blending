"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const BannerSchema = new mongoose_1.Schema({
    bannerName: {
        type: String,
        required: true,
    },
    description: String,
    channel: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'ThemeChannel' },
    link: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: Date,
});
const Banner = (0, mongoose_1.model)('Banner', BannerSchema);
exports.default = Banner;
