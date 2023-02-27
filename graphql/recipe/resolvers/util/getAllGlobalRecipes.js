"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const recipeModel_1 = __importDefault(require("../../../../models/recipeModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../../models/UserRecipeProfile"));
async function bringAllGlobalRecipes(userId) {
    let recipes = await recipeModel_1.default.find({
        global: true,
        userId: null,
        addedByAdmin: true,
        discovery: true,
        isPublished: true,
    });
    for (let i = 0; i < recipes.length; i++) {
        await UserRecipeProfile_1.default.create({
            recipeId: recipes[i]._id,
            userId: userId,
            isMatch: recipes[i].isMatch,
            allRecipes: false,
            myRecipes: false,
            turnedOffVersions: recipes[i].turnedOffVersion,
            turnedOnVersions: recipes[i].turnedOnVersions,
            defaultVersion: recipes[i].defaultVersion,
        });
    }
}
exports.default = bringAllGlobalRecipes;
