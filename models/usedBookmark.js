"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const usedBookmark = new mongoose_1.Schema({
    entityId: String,
    usedCount: Number,
});
const UsedBookmark = (0, mongoose_1.model)('UsedBookmark', usedBookmark);
exports.default = UsedBookmark;
