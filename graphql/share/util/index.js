"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const share_1 = __importDefault(require("../../../models/share"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
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
    let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        //@ts-ignore
        recipeId: share.recipeId,
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
        ],
        select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating',
    })
        .populate({
        path: 'defaultVersion',
        model: 'RecipeVersion',
        populate: {
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        },
    })
        .populate({
        path: 'originalVersion',
        model: 'RecipeVersion',
        populate: {
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        },
    })
        .populate({
        path: 'turnedOnVersion',
        model: 'RecipeVersion',
        select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
        options: { sort: { isDefault: -1 } },
    })
        .populate({
        path: 'turnedOffVersion',
        model: 'RecipeVersion',
    });
    let collectionRecipes = [];
    let memberCollections = await memberModel_1.default.find({ _id: userId })
        .populate({
        path: 'collections',
        model: 'UserCollection',
        select: 'recipes',
    })
        .select('-_id collections');
    for (let i = 0; i < memberCollections[0].collections.length; i++) {
        //@ts-ignore
        let items = memberCollections[0].collections[i].recipes.map(
        //@ts-ignore
        (recipe) => {
            return {
                recipeId: String(recipe._id),
                recipeCollection: String(memberCollections[0].collections[i]._id),
            };
        });
        collectionRecipes.push(...items);
    }
    let userNotes = await userNote_1.default.find({
        //@ts-ignore
        recipeId: share.recipeId,
        userId: userId,
    });
    let addedToCompare = false;
    let compare = await Compare_1.default.findOne({
        userId: userId,
        //@ts-ignore
        recipeId: share.recipeId,
    });
    if (compare) {
        addedToCompare = true;
    }
    let collectionData = collectionRecipes.filter(
    //@ts-ignore
    (recipeData) => recipeData.recipeId === String(share.recipeId));
    if (collectionData.length === 0) {
        collectionData = null;
    }
    else {
        //@ts-ignore
        collectionData = collectionData.map((data) => data.recipeCollection);
    }
    let data = {
        recipe: userProfileRecipe,
        notes: userNotes.length,
        addedToCompare: addedToCompare,
        userCollections: collectionData,
    };
    return data;
}
exports.default = default_1;
