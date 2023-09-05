"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../../../utils/AppError"));
const checkGroceryList_1 = __importDefault(require("../../../grocery/util/checkGroceryList"));
const memberModel_1 = __importDefault(require("../../../../models/memberModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../../models/UserRecipeProfile"));
const GroceryList_1 = __importDefault(require("../../../../models/GroceryList"));
async function addGroceryListFromARecipe(recipeId, memberId) {
    let recipe = await UserRecipeProfile_1.default.findOne({
        recipeId: recipeId,
        userId: memberId,
    })
        .populate({
        path: 'defaultVersion',
        model: 'RecipeVersion',
        populate: {
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        },
    })
        .select('defaultVersion')
        .lean();
    let member = await memberModel_1.default.findOne({ _id: memberId }).select('_id');
    if (!recipe || !member) {
        return new AppError_1.default('Recipe or member not found', 404);
    }
    let groceryList = await GroceryList_1.default.findOne({
        memberId: memberId,
    });
    if (!groceryList) {
        groceryList = await GroceryList_1.default.create({
            memberId: memberId,
            list: [],
        });
    }
    let data = {};
    data.memberId = memberId;
    data.ingredients = [];
    for (let i = 0; i < recipe.defaultVersion.ingredients.length; i++) {
        if (!groceryList.list.filter(
        //@ts-ignore
        (item) => String(item.ingredientId) ===
            String(recipe.defaultVersion.ingredients[i].ingredientId))[0]) {
            data.ingredients.push({
                ingredientId: String(recipe.defaultVersion.ingredients[i].ingredientId._id),
                selectedPortion: recipe.defaultVersion.ingredients[i].selectedPortion.name,
                quantity: recipe.defaultVersion.ingredients[i].selectedPortion.quantity,
            });
        }
    }
    if (data.ingredients.length === 0) {
        return 'done';
    }
    console.log(data.ingredients[0].ingredientId);
    await (0, checkGroceryList_1.default)(data, GroceryList_1.default, groceryList);
    return 'done';
}
exports.default = addGroceryListFromARecipe;
