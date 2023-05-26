"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const temporaryCompareCollection_1 = __importDefault(require("../../../../models/temporaryCompareCollection"));
const changeCompare_1 = __importDefault(require("../../../member/resolvers/util/changeCompare"));
async function default_1(userId) {
    const previousDay = new Date();
    previousDay.setDate(previousDay.getDate() - 1);
    let temporaryCompareList = await temporaryCompareCollection_1.default.find({
        userId: userId,
        createdAt: {
            $lt: previousDay,
        },
    });
    for (let i = 0; i < temporaryCompareList.length; i++) {
        await (0, changeCompare_1.default)(temporaryCompareList[i].recipeId, temporaryCompareList[i].userId);
        await temporaryCompareCollection_1.default.deleteOne({
            _id: temporaryCompareList[i]._id,
        });
    }
    return await temporaryCompareCollection_1.default.find({
        userId: userId,
    });
}
exports.default = default_1;
