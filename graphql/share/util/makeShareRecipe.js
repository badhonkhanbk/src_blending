"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
async function default_1(recipeId, userId) {
    let recipe = await recipeModel_1.default.findOne({
        _id: recipeId,
    })
        .populate([
        {
            path: 'recipeBlendCategory',
            model: 'RecipeCategory',
        },
        {
            path: 'brand',
            model: 'RecipeBrand',
        },
        {
            path: 'userId',
            model: 'User',
            select: 'firstName lastName image displayName email',
        },
        {
            path: 'originalVersion',
            model: 'RecipeVersion',
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                {
                    path: 'createdBy',
                    select: '_id displayName firstName lastName image email',
                },
            ],
        },
    ])
        .select('mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating description userId userId');
    // console.log('jin', recipe._id);
    let userRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        recipeId: recipeId,
    }).select('defaultVersion');
    // console.log('!', userRecipe);
    // console.log('x', recipe.originalVersion._id);
    if (!userRecipe) {
        return null;
    }
    let defaultVersion = await RecipeVersionModel_1.default.findOne({
        _id: userRecipe.defaultVersion,
    }).populate([
        {
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName selectedImage',
        },
        {
            path: 'createdBy',
            select: '_id displayName firstName lastName image email',
        },
    ]);
    // let turnedOnVersion = await RecipeVersionModel.find({
    //   _id: { $in: share.shareData.turnedOnVersions },
    // }).populate([
    //   {
    //     path: 'ingredients.ingredientId',
    //     model: 'BlendIngredient',
    //     select: 'ingredientName selectedImage',
    //   },
    //   {
    //     path: 'createdBy',
    //     select: '_id displayName firstName lastName image email',
    //   },
    // ]);
    let sharedBy = await memberModel_1.default.findOne({
        _id: userId,
    });
    // console.log('sb', sharedBy);
    let userProfileRecipe = {
        recipeId: recipe,
        defaultVersion: defaultVersion,
        turnedOnVersions: [],
        turnedOffVersions: [],
        isMatch: String(recipe.originalVersion._id) === String(userRecipe.defaultVersion),
        allRecipes: false,
        myRecipes: false,
        tags: [],
        addedToCompare: false,
        userCollections: [],
        versionsCount: 0,
        personalRating: 0,
        sharedBy: sharedBy,
    };
    // console.log('daffodil', userProfileRecipe);
    return userProfileRecipe;
}
exports.default = default_1;
