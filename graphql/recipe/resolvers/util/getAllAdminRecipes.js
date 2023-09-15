"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const getAdminRecipeDetails_1 = __importDefault(require("./getAdminRecipeDetails"));
const recipeModel_1 = __importDefault(require("../../../../models/recipeModel"));
async function getAllAdminRecipe(limit, page, recipeIds) {
    if (!limit) {
        limit = 12;
    }
    if (!page) {
        page = 1;
    }
    let skip = limit * (page - 1);
    let find = {};
    if (recipeIds.length !== 0) {
        find._id = { $in: recipeIds };
    }
    let userProfileRecipes = await recipeModel_1.default.find(find)
        .populate({
        path: 'recipeBlendCategory',
        model: 'RecipeCategory',
    })
        .populate({
        path: 'userId',
        model: 'User',
        select: 'firstName lastName image displayName email',
    })
        .populate({
        path: 'defaultVersion',
        populate: [
            {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
            {
                path: 'createdBy',
                select: '_id displayName firstName lastName image email',
            },
        ],
    })
        .populate({
        path: 'brand',
        model: 'RecipeBrand',
    })
        .populate({
        path: 'recipeBlendCategory',
        model: 'RecipeCategory',
    })
        .select('mainEntityOfPage name defaultVersion image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId collections')
        .limit(limit)
        .skip(skip)
        .sort({ createdAt: 1 })
        .lean();
    // console.log(userProfileRecipes[0].collections);
    return await (0, getAdminRecipeDetails_1.default)(userProfileRecipes);
}
exports.default = getAllAdminRecipe;
