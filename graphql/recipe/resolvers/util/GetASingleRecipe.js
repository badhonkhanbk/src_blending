"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const UserRecipeProfile_1 = __importDefault(require("../../../../models/UserRecipeProfile"));
const share_1 = __importDefault(require("../../../../models/share"));
const AppError_1 = __importDefault(require("../../../../utils/AppError"));
const makeGlobalRecipe_1 = __importDefault(require("../../../share/util/makeGlobalRecipe"));
const memberModel_1 = __importDefault(require("../../../../models/memberModel"));
const Compare_1 = __importDefault(require("../../../../models/Compare"));
const userNote_1 = __importDefault(require("../../../../models/userNote"));
async function default_1(recipeId, userId, token) {
    let data;
    if (token) {
        let share = await share_1.default.findOne({ _id: token });
        console.log(share);
        if (!share.isGlobal) {
            let auth = share.shareTo.filter((sharePerson) => {
                return String(sharePerson.userId) === String(userId);
            })[0];
            console.log(auth);
            if (!auth) {
                return new AppError_1.default('Invalid token', 404);
            }
        }
        if (!share) {
            return new AppError_1.default('Invalid token', 404);
        }
        return await (0, makeGlobalRecipe_1.default)(share, userId.toString());
    }
    if (!recipeId && !token) {
        return new AppError_1.default('Recipe not found', 404);
    }
    let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
        userId: userId,
        recipeId: recipeId,
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
            {
                path: 'originalVersion',
                model: 'RecipeVersion',
                populate: [
                    {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName featuredImage images',
                    },
                    {
                        path: 'createdBy',
                        select: '_id displayName firstName lastName image email',
                    },
                ],
            },
        ],
        select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating description userId userId totalTime',
    })
        .populate({
        path: 'defaultVersion',
        model: 'RecipeVersion',
        populate: [
            {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
                select: 'ingredientName featuredImage images',
            },
            {
                path: 'createdBy',
                select: '_id displayName firstName lastName image email',
            },
        ],
    })
        .populate({
        path: 'turnedOnVersions',
        model: 'RecipeVersion',
        select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
        options: { sort: { isDefault: -1 } },
    })
        .populate({
        path: 'turnedOffVersions',
        model: 'RecipeVersion',
        select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
    })
        .lean();
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
        recipeId: recipeId,
        userId: userId,
    });
    let addedToCompare = false;
    let compare = await Compare_1.default.findOne({
        userId: userId,
        recipeId: recipeId,
    });
    if (compare) {
        addedToCompare = true;
    }
    let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipeId));
    if (collectionData.length === 0) {
        collectionData = null;
    }
    else {
        //@ts-ignore
        collectionData = collectionData.map((data) => data.recipeCollection);
    }
    let versionsCount = 0;
    versionsCount +=
        +userProfileRecipe.turnedOnVersions.length +
            +userProfileRecipe.turnedOffVersions.length;
    if (!userProfileRecipe.isMatch) {
        versionsCount++;
    }
    await UserRecipeProfile_1.default.findOneAndUpdate({
        userId: userId,
        recipeId: recipeId,
    }, {
        lastSeen: Date.now(),
    });
    return {
        //@ts-ignore
        ...userProfileRecipe,
        notes: userNotes.length,
        addedToCompare: addedToCompare,
        userCollections: collectionData,
        versionsCount: versionsCount,
    };
}
exports.default = default_1;
