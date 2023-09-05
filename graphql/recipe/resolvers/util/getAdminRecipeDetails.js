"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
// import RecipeFact from '../../../../models/RecipeFacts';
async function getAdminRecipeDetails(recipes) {
    let returnRecipe = [];
    // console.log(userProfileRecipes);
    for (let i = 0; i < recipes.length; i++) {
        returnRecipe.push({
            ...recipes[i],
            versionCount: await RecipeVersionModel_1.default.countDocuments({
                recipeId: recipes[i]._id,
            }),
        });
    }
    // let facts = await RecipeFact.findOne({
    //   versionId: userProfileRecipes[i].defaultVersion._id,
    // }).select('calorie gigl');
    // if (facts) {
    //   returnRecipe[i].calorie = facts.calorie.value;
    //   returnRecipe[i].netCarbs = facts.gigl.netCarbs;
    //   returnRecipe[i].rxScore = 100;
    // } else {
    //   returnRecipe[i].calorie = 0;
    //   returnRecipe[i].netCarbs = 0;
    //   returnRecipe[i].rxScore = 0;
    //
    return returnRecipe;
}
exports.default = getAdminRecipeDetails;
