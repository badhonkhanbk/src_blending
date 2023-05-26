"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
async function default_1(recipeId, userId, mergeWithUser) {
    console.log('here');
    let recipe = await recipeModel_1.default.findOne({
        _id: recipeId,
    });
    if (!recipe) {
        return null;
    }
    let userRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        recipeId: recipeId,
    });
    console.log('!', userRecipe);
    if (!userRecipe) {
        return null;
    }
    let defaultVersion = await RecipeVersionModel_1.default.findOne({
        _id: userRecipe.defaultVersion,
    });
    if (!defaultVersion) {
        return null;
    }
    await checkShareAndAdd(recipe, defaultVersion._id, mergeWithUser);
    return recipeId;
}
exports.default = default_1;
async function checkShareAndAdd(recipe, defaultVersion, userId) {
    let userRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        recipeId: recipe._id,
    });
    if (!userRecipe) {
        let isMatch = false;
        if (String(recipe.originalVersion) === String(defaultVersion)) {
            isMatch = true;
        }
        console.log('aaaaa');
        await UserRecipeProfile_1.default.create({
            userId: userId,
            recipeId: recipe._id,
            defaultVersion: defaultVersion,
            turnedOnVersions: [],
            isMatch: isMatch,
            allRecipe: false,
            myRecipes: false,
        });
        return true;
    }
    let checkDefault = String(defaultVersion) === String(userRecipe.defaultVersion);
    if (checkDefault) {
        // console.log('here');
        // await mergeTurnedOnVersion(
        //   userId,
        //   recipeId,
        //   share.shareData.turnedOnVersions
        // );
        return true;
    }
    let checkOriginal = String(defaultVersion) === String(recipe.originalVersion);
    if (checkOriginal) {
        // await mergeTurnedOnVersion(
        //   userId,
        //   share.shareData.recipeId,
        //   share.shareData.turnedOnVersions
        // );
        return true;
    }
    let checkTurnedOn = userRecipe.turnedOnVersions.filter((version) => {
        return String(version) === String(defaultVersion);
    })[0];
    if (checkTurnedOn) {
        // await mergeTurnedOnVersion(
        //   userId,
        //   share.shareData.recipeId,
        //   share.shareData.turnedOnVersions
        // );
        return true;
    }
    let checkTurnedOff = userRecipe.turnedOffVersions.filter((version) => {
        return String(version) === String(defaultVersion);
    })[0];
    if (checkTurnedOff) {
        // await mergeTurnedOnVersion(
        //   userId,
        //   share.shareData.recipeId,
        //   share.shareData.turnedOnVersions
        // );
        return true;
    }
    await UserRecipeProfile_1.default.findOneAndUpdate({
        userId: userId,
        recipeId: recipe._id,
    }, {
        $addToSet: {
            turnedOnVersions: {
                $push: defaultVersion,
            },
        },
    });
    return true;
}
