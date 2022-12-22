"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const compareSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    recipeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Recipe' },
});
const Compare = (0, mongoose_1.model)('compare', compareSchema);
exports.default = Compare;
