"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const recycledIngredient = new mongoose_1.Schema({
    refDtabaseIngredientId: [String],
});
const RecycledIngredient = (0, mongoose_1.model)('RecycledIngredient', recycledIngredient);
exports.default = RecycledIngredient;
