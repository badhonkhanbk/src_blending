"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const TemporaryCompareCollectionSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    recipeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'RecipeModel' },
    versionId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'RecipeVersion',
    },
    url: String,
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const TemporaryCompareCollection = (0, mongoose_1.model)('TemporaryCompareCollection', TemporaryCompareCollectionSchema);
exports.default = TemporaryCompareCollection;
