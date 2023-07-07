"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendNutrient_1 = __importDefault(require("../../../../../models/blendNutrient"));
async function nutrientRankChange(nutrientID, rank, prevRank) {
    let blendNutrient = await blendNutrient_1.default.findOneAndUpdate({
        _id: nutrientID,
    }, { rank: +rank }, { new: true }).select('_id category parent');
    let blendNutrients = await blendNutrient_1.default.find({
        category: blendNutrient.category,
        parent: blendNutrient.parent,
    })
        .select('_id rank')
        .sort('rank');
    if (prevRank > rank) {
        for (let i = +rank - 1; i <= prevRank.valueOf(); i++) {
            if (nutrientID !== String(blendNutrients[i]._id)) {
                await blendNutrient_1.default.findOneAndUpdate({
                    _id: blendNutrients[i]._id,
                }, { $inc: { rank: 1 } });
            }
        }
    }
    else {
        for (let i = +rank - 1; i >= prevRank.valueOf(); i--) {
            if (nutrientID !== String(blendNutrients[i]._id)) {
                await blendNutrient_1.default.findOneAndUpdate({
                    _id: blendNutrients[i]._id,
                }, { $inc: { rank: -1 } });
            }
        }
    }
}
exports.default = nutrientRankChange;
