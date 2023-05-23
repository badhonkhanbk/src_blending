"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const share_1 = __importDefault(require("../../../models/share"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
async function default_1(token, userId) {
    const share = await share_1.default.findOne({ _id: token });
    if (!share) {
        return null;
    }
    if (!share.isGlobal) {
        let found = false;
        for (let i = 0; i < share.shareTo.length; i++) {
            if (String(share.shareTo[i].userId) === userId &&
                share.shareTo[i].hasAccepted) {
                found = true;
                break;
            }
        }
        if (!found) {
            return null;
        }
    }
    let res = await checkShareAndAdd(share, userId);
    if (!res) {
        return null;
    }
    return share.shareData.recipeId;
}
exports.default = default_1;
async function checkShareAndAdd(share, userId) {
    let userRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        //@ts-ignore
        recipeId: share.recipeId,
    });
    let recipe = await recipe_1.default.findOne({
        _id: share.shareData.recipeId,
    }).select('_id originalVersion turnedOn');
    if (!recipe) {
        return false;
    }
    let version = await RecipeVersionModel_1.default.findOne({
        _id: share.shareData.version,
    }).select('_id');
    if (!version) {
        return false;
    }
    if (!userRecipe) {
        let isMatch = false;
        if (String(recipe.originalVersion) === String(share.shareData.version)) {
            isMatch = true;
        }
        await UserRecipeProfile_1.default.create({
            userId: userId,
            recipeId: share.shareData.recipeId,
            defaultVersion: share.shareData.version,
            isMatch: isMatch,
            allRecipe: false,
            myRecipes: false,
        });
        return true;
    }
    let checkDefault = String(share.shareData.version) === String(userRecipe.defaultVersion);
    if (checkDefault) {
        return true;
    }
    let checkOriginal = String(share.shareData.version) === String(recipe.originalVersion);
    if (checkOriginal) {
        return true;
    }
    let checkTurnedOn = userRecipe.turnedOnVersions.filter((version) => {
        return String(version) === String(share.shareData.version);
    })[0];
    if (checkTurnedOn) {
        return true;
    }
    let checkTurnedOff = userRecipe.turnedOffVersions.filter((version) => {
        return String(version) === String(share.shareData.version);
    })[0];
    if (checkTurnedOff) {
        return true;
    }
    await UserRecipeProfile_1.default.findOneAndUpdate({
        userId: userId,
        recipeId: share.shareData.recipeId,
    }, {
        $push: {
            turnedOnfVersions: share.shareData.version,
        },
    });
}
