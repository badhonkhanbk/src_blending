"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
async function default_1(share, userId) {
    let recipe = await recipe_1.default.findOne({
        _id: share.shareData.recipeId,
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
    let defaultVersion = await RecipeVersionModel_1.default.findOne({
        _id: share.shareData.version,
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
    let sharedBy = await memberModel_1.default.findOne({
        _id: share.sharedBy,
    });
    let userProfileRecipe = {
        recipeId: recipe,
        defaultVersion: defaultVersion,
        turnedOnVersions: [],
        turnedOffVersions: [],
        isMatch: String(recipe.originalVersion._id) === String(share.shareData.version),
        allRecipes: false,
        myRecipes: false,
        tags: [],
        addedToCompare: false,
        userCollections: [],
        versionsCount: 0,
        personalRating: 0,
        sharedBy: sharedBy,
    };
    return userProfileRecipe;
}
exports.default = default_1;
