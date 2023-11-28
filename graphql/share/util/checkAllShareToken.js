"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const share_1 = __importDefault(require("../../../models/share"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("../../recipe/resolvers/util/getNotesCompareAndUserCollection"));
async function default_1(tokens, userId) {
    let recipes = [];
    let recipeIds = [];
    for (let i = 0; i < tokens.length; i++) {
        const share = await share_1.default.findOne({ _id: tokens[i] });
        if (!share) {
            continue;
        }
        if (recipeIds.length > 12) {
            break;
        }
        recipeIds.push(share.shareData.recipeId);
    }
    let userProfileRecipes = await UserRecipeProfile_1.default.find({
        userId: userId,
        recipeId: {
            $in: recipeIds,
        },
    })
        .populate({
        path: 'recipeId',
        model: 'RecipeModel',
        populate: [
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
        ],
        select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId',
    })
        .populate({
        path: 'defaultVersion',
        model: 'RecipeVersion',
        populate: {
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        },
    })
        .lean();
    let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
    return returnRecipe;
}
exports.default = default_1;
