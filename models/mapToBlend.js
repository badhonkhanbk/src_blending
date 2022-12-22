"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const mapToBlend = new mongoose_1.Schema({
    blendNutrientId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'BlendNutrient' },
    srcUniqueNutrientId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'UniqueNutrient' },
    rank: Number,
});
const MapToBlend = (0, mongoose_1.model)('MapToBlend', mapToBlend);
exports.default = MapToBlend;
