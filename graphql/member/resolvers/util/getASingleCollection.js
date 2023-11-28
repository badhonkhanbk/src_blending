"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../../../utils/AppError"));
const userCollection_1 = __importDefault(require("../../../../models/userCollection"));
const UserRecipeProfile_1 = __importDefault(require("../../../../models/UserRecipeProfile"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("../../../recipe/resolvers/util/getNotesCompareAndUserCollection"));
const mongoose_1 = __importDefault(require("mongoose"));
const share_1 = __importDefault(require("../../../../models/share"));
const collectionShareGlobal_1 = __importDefault(require("../../../../models/collectionShareGlobal"));
const checkAllShareToken_1 = __importDefault(require("../../../share/util/checkAllShareToken"));
const makeShareRecipe_1 = __importDefault(require("../../../share/util/makeShareRecipe"));
async function getASingleCollection(slug, userId, collectionId, token, singleRecipeCollectionId, page, limit) {
    let searchId;
    let query = {};
    if (singleRecipeCollectionId) {
        return await getSingleRecipeCollection(userId.toString());
    }
    if (token) {
        console.log('here');
        let globalShare = await collectionShareGlobal_1.default.findOne({
            _id: token,
        });
        if (!globalShare) {
            return new AppError_1.default('Invalid token', 400);
        }
        let acceptedGlobalShare = globalShare.globalAccepted.filter((user) => String(user) === userId)[0];
        if (!acceptedGlobalShare) {
            return await viewSharedCollection(userId, token, page, limit);
        }
        query = {
            _id: globalShare.collectionId,
        };
    }
    else if (collectionId) {
        let collection = await userCollection_1.default.findOne({
            _id: collectionId,
        }).select('shareTo');
        if (collection.shareTo.length === 0) {
            return new AppError_1.default('Invalid collection', 400);
        }
        else {
            let shareTo = collection.shareTo.filter((share) => String(share.userId) === userId)[0];
            if (!shareTo) {
                return new AppError_1.default('Invalid collection', 400);
            }
            if (shareTo.hasAccepted === false) {
                return await viewSharedCollection(userId, collectionId, page, limit);
            }
        }
        query = {
            _id: collectionId,
        };
    }
    else {
        searchId = userId;
        query = {
            slug: slug,
            userId: searchId,
        };
    }
    let collection = await userCollection_1.default.findOne(query);
    if (!page || page <= 0) {
        page = 1;
    }
    if (!limit) {
        limit = 10;
    }
    let userProfileRecipes = await UserRecipeProfile_1.default.find({
        userId: userId,
        recipeId: {
            $in: collection.recipes,
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
        .lean()
        .limit(limit)
        .skip(limit * (page - 1));
    let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
    return {
        _id: collection._id,
        name: collection.name,
        slug: collection.slug,
        image: collection.image,
        totalRecipes: collection.recipes.length,
        recipes: returnRecipe,
        creatorInfo: collection.userId,
        accepted: true,
    };
}
exports.default = getASingleCollection;
async function getSingleRecipeCollection(userId) {
    let shares = await share_1.default.find({
        shareTo: {
            $elemMatch: {
                userId: new mongoose_1.default.mongo.ObjectId(userId),
                hasAccepted: false,
            },
        },
    }).select('_id');
    let singleSharedRecipes = [];
    if (shares.length > 0) {
        let mappedForSingleRecipeCollection = shares.map((share) => share._id.toString());
        singleSharedRecipes = await (0, checkAllShareToken_1.default)(
        //@ts-ignore
        mappedForSingleRecipeCollection, userId);
    }
    return {
        _id: new mongoose_1.default.Types.ObjectId(),
        name: 'Single Recipes',
        slug: 'single-recipes',
        //@ts-ignore
        image: null,
        recipes: singleSharedRecipes,
        accepted: true,
    };
}
async function viewSharedCollection(userId, token, page, limit) {
    if (!page || page <= 0) {
        page = 1;
    }
    if (!limit) {
        limit = 10;
    }
    const shareCollection = await userCollection_1.default.findOne({
        _id: token,
    }).populate({
        path: 'userId',
    });
    // console.log('ssss', shareCollection.userId);
    if (!shareCollection) {
        return new AppError_1.default('Invalid token', 404);
    }
    let start = limit * (page - 1) > shareCollection.recipes.length - 1
        ? shareCollection.recipes.length - 1
        : limit * (page - 1);
    let end = start + limit > shareCollection.recipes.length - 1
        ? shareCollection.recipes.length
        : start + limit;
    let returnRecipe = [];
    for (let i = start; i < end; i++) {
        // console.log(i);
        returnRecipe.push(await (0, makeShareRecipe_1.default)(shareCollection.recipes[i], String(shareCollection.userId._id)));
        // console.log(returnRecipe[i].recipeId._id);
    }
    return {
        _id: shareCollection._id,
        name: shareCollection.name,
        slug: shareCollection.slug,
        image: shareCollection.image,
        totalRecipes: shareCollection.recipes.length,
        recipes: returnRecipe,
        creatorInfo: shareCollection.userId,
        accepted: false,
    };
}
