"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const share_1 = __importDefault(require("../../../models/share"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
async function default_1(tokens, userId) {
    let recipes = [];
    for (let i = 0; i < tokens.length; i++) {
        const share = await share_1.default.findOne({ _id: tokens[i] });
        if (!share) {
            continue;
        }
        let recipe = await recipeModel_1.default.findOne({
            _id: share.shareData.recipeId,
        })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName',
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
        });
        // .populate({
        //   path: 'ingredients.ingredientId',
        //   model: 'BlendIngredient',
        //   select: 'ingredientName',
        // })
        // .populate({
        //   path: 'defaultVersion',
        //   model: 'RecipeVersion',
        //   populate: {
        //     path: 'ingredients.ingredientId',
        //     model: 'BlendIngredient',
        //     select: 'ingredientName',
        //   },
        //   select: 'postfixTitle',
        // })
        // .populate({
        //   path: 'userId',
        //   model: 'User',
        //   select: '_id displayName image firstName lastName email',
        // })
        // .populate('brand')
        // .populate('recipeBlendCategory')
        delete recipe.recipeVersion;
        let defaultVersion = await RecipeVersionModel_1.default.findOne({
            _id: share.shareData.version,
        })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName',
        });
        let data = recipe;
        data.defaultVersion = defaultVersion;
        if (String(data.defaultVersion._id) === String(data.originalVersion._id)) {
            data.recipeVersion = [defaultVersion];
            data.recipeVersion[0].isDefault = true;
            data.recipeVersion[0].isOriginal = true;
        }
        else {
            data.recipeVersion = [defaultVersion, recipe.originalVersion];
            data.recipeVersion[0].isDefault = true;
            data.recipeVersion[0].isOriginal = false;
            data.recipeVersion[1].isDefault = false;
            data.recipeVersion[1].isOriginal = true;
        }
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
            recipeId: recipe._id,
            userId: userId,
        });
        let addedToCompare = false;
        let compare = await Compare_1.default.findOne({
            userId: userId,
            recipeId: recipe._id,
        });
        if (compare) {
            addedToCompare = true;
        }
        let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipe._id));
        if (collectionData.length === 0) {
            collectionData = null;
        }
        else {
            //@ts-ignore
            collectionData = collectionData.map((data) => data.recipeCollection);
        }
        data.token = share._id;
        data.notes = userNotes.length;
        data.addedToCompare = addedToCompare;
        data.userCollections = collectionData;
        recipes.push(data);
    }
    return recipes;
}
exports.default = default_1;
