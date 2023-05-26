"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Compare_1 = __importDefault(require("../../../../models/Compare"));
const memberModel_1 = __importDefault(require("../../../../models/memberModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../../models/UserRecipeProfile"));
const AppError_1 = __importDefault(require("../../../../utils/AppError"));
async function default_1(recipeId, userId) {
    let userRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        recipeId: recipeId,
    });
    if (!userRecipe) {
        return new AppError_1.default('recipe not found', 401);
    }
    let user = await memberModel_1.default.findOne({ _id: userId });
    let check = false;
    let updatedUser;
    for (let i = 0; i < user.compareList.length; i++) {
        if (String(user.compareList[i]) === recipeId) {
            updatedUser = await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $pull: { compareList: recipeId }, $inc: { compareLength: -1 } }, { new: true });
            check = true;
            await Compare_1.default.findOneAndRemove({
                userId: userId,
                recipeId: recipeId,
                versionId: userRecipe.defaultVersion,
            });
            break;
        }
    }
    if (!check) {
        updatedUser = await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $push: { compareList: recipeId }, $inc: { compareLength: 1 } }, { new: true });
        await Compare_1.default.create({
            recipeId: recipeId,
            userId: userId,
            versionId: userRecipe.defaultVersion,
        });
    }
    return updatedUser.compareList.length;
}
exports.default = default_1;
