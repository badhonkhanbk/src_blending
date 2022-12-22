"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const GlobalBookmarkSchema = new mongoose_1.Schema({
    entityId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true,
    },
    onModel: {
        type: String,
        required: true,
        enum: ['BlendIngredient', 'BlendNutrient'],
    },
    link: String,
    type: String,
});
const GlobalBookmark = (0, mongoose_1.model)('GlobalBookmark', GlobalBookmarkSchema);
exports.default = GlobalBookmark;
