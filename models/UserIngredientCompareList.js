"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userIngredientsCompareSchema = new mongoose_1.Schema({
    userId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User', unique: true },
    ingredients: [{ type: mongoose_1.SchemaTypes.ObjectId, ref: 'BlendIngredient' }],
});
const UserIngredientsCompare = (0, mongoose_1.model)('userIngredientsCompare', userIngredientsCompareSchema);
exports.default = UserIngredientsCompare;
