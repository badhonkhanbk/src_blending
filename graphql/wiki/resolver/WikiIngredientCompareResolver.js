"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const UserIngredientCompareList_1 = __importDefault(require("../../../models/UserIngredientCompareList"));
const wikiComment_1 = __importDefault(require("../../../models/wikiComment"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const CompareIngredient_1 = __importDefault(require("../schemas/CompareIngredient"));
let WikiIngredientsCompareResolver = class WikiIngredientsCompareResolver {
    /**
     * Add or remove an ingredient to/from the wiki compare list for a user.
     *
     * @param {String} userId - The ID of the user.
     * @param {String} ingredientId - The ID of the ingredient.
     * @return {String} The result message indicating success or failure.
     */
    async addOrRemoveToWikiCompareList(userId, ingredientId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let ingredient = await blendIngredient_1.default.findOne({ _id: ingredientId });
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let alreadyInCompare = await UserIngredientCompareList_1.default.findOne({
            userId: userId,
            ingredients: { $in: ingredientId },
        });
        if (alreadyInCompare) {
            await UserIngredientCompareList_1.default.findOneAndUpdate({ _id: alreadyInCompare._id }, { $pull: { ingredients: ingredientId } });
            await memberModel_1.default.findOneAndUpdate({ _id: userId }, {
                $inc: { wikiCompareCount: -1 },
            });
            return 'Successfully removed';
        }
        let compare = await UserIngredientCompareList_1.default.findOne({
            userId: userId,
        });
        if (!compare) {
            await UserIngredientCompareList_1.default.create({
                userId: userId,
                ingredients: [ingredientId],
            });
        }
        else {
            if (!compare.ingredients.filter(
            //@ts-ignore
            (ingredient) => ingredient.toString() === ingredientId)[0]) {
                //@ts-ignore
                compare.ingredients.push(ingredientId);
                await compare.save();
            }
        }
        await memberModel_1.default.findOneAndUpdate({ _id: userId }, {
            $inc: { wikiCompareCount: 1 },
        });
        return 'Successfully added';
    }
    /**
     * Removes an ingredient from the user's wiki compare list.
     *
     * @param {String} userId - The ID of the user.
     * @param {String} ingredientId - The ID of the ingredient to be removed.
     * @return {Promise<string>} The result of the operation.
     */
    async removeFromWikiCompareList(userId, ingredientId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let ingredient = await blendIngredient_1.default.findOne({ _id: ingredientId });
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let compare = await UserIngredientCompareList_1.default.findOne({
            userId: userId,
        });
        if (!compare) {
            await UserIngredientCompareList_1.default.create({
                userId: userId,
                ingredients: [],
            });
        }
        else {
            if (!compare.ingredients.filter(
            //@ts-ignore
            (ingredient) => ingredient.toString() === ingredientId)[0]) {
                await UserIngredientCompareList_1.default.findOneAndUpdate({ _id: compare._id }, { $pull: { ingredients: ingredientId } });
            }
        }
        await memberModel_1.default.findOneAndUpdate({ _id: userId }, {
            $inc: { wikiCompareCount: -1 },
        });
        return 'Success';
    }
    /**
     * Changes the compare list of a user in the wiki.
     *
     * @param {String} userId - the ID of the user
     * @param {string[]} ingredients - an array of ingredients
     * @return {Promise<string>} - a promise that resolves to 'Success'
     */
    async changeWikiCompareList(userId, ingredients) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let compare = await UserIngredientCompareList_1.default.findOne({
            userId: userId,
        });
        if (!compare) {
            return new AppError_1.default('Compare list not found', 404);
        }
        await UserIngredientCompareList_1.default.findOneAndUpdate({ _id: compare._id }, {
            ingredients: ingredients,
        });
        return 'Success';
    }
    /**
     * Empty the wiki compare list for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {String} Returns 'Success' if the operation is successful.
     */
    async emptyWikiCompareList(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        await UserIngredientCompareList_1.default.deleteMany({ userId: userId });
        await memberModel_1.default.findOneAndUpdate({ _id: userId }, {
            wikiCompareCount: 0,
        });
        return 'Success';
    }
    /**
     * Retrieves the compare list from the UserIngredientsCompareModel for the specified user.
     *
     * @param {String} userId - The ID of the user
     * @return {Array} An array containing the retrieved compare list
     */
    async getWikiCompareList(userId) {
        let compareList = await UserIngredientCompareList_1.default.findOne({
            userId: userId,
        }).populate({
            path: 'ingredients',
            model: 'BlendIngredient',
            select: '-srcFoodReference -blendNutrients -notBlendNutrients -collections -varrient -bodies',
        });
        let returnData = [];
        for (let i = 0; i < compareList.ingredients.length; i++) {
            let data = {
                _id: compareList.ingredients[i]._id,
                //@ts-ignore
                wikiTitle: compareList.ingredients[i].wikiTitle
                    ? //@ts-ignore
                        compareList.ingredients[i].wikiTitle
                    : //@ts-ignore
                        compareList.ingredients[i].ingredientName,
                //@ts-ignore
                wikiDescription: compareList.ingredients[i].wikiDescription
                    ? //@ts-ignore
                        compareList.ingredients[i].wikiDescription
                    : ' ',
                type: 'Ingredient',
                //@ts-ignore
                category: compareList.ingredients[i].category
                    ? //@ts-ignore
                        compareList.ingredients[i].category
                    : '',
                //@ts-ignore
                status: compareList.ingredients[i].blendStatus,
                //@ts-ignore
                publishDate: compareList.ingredients[i].createdAt,
                //@ts-ignore
                portions: compareList.ingredients[i].portions,
                //@ts-ignore
                image: compareList.ingredients[i].featuredImage,
                //@ts-ignore
                description: compareList.ingredients[i].description,
                publishedBy: 'g. braun',
                //@ts-ignore
                isPublished: compareList.ingredients[i].isPublished,
                //@ts-ignore
                featuredImage: compareList.ingredients[i].featuredImage,
            };
            let comments = await wikiComment_1.default.find({
                entityId: compareList.ingredients[i]._id,
            }).select('_id');
            let compare = await UserIngredientCompareList_1.default.findOne({
                userId: userId,
                ingredients: { $in: compareList.ingredients[i]._id },
            });
            if (compare) {
                data.hasInCompare = true;
            }
            else {
                data.hasInCompare = false;
            }
            data.commentsCount = comments.length;
            returnData.push(data);
        }
        return returnData;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiIngredientsCompareResolver.prototype, "addOrRemoveToWikiCompareList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], WikiIngredientsCompareResolver.prototype, "removeFromWikiCompareList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('ingredients', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], WikiIngredientsCompareResolver.prototype, "changeWikiCompareList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiIngredientsCompareResolver.prototype, "emptyWikiCompareList", null);
__decorate([
    (0, type_graphql_1.Query)(() => [CompareIngredient_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], WikiIngredientsCompareResolver.prototype, "getWikiCompareList", null);
WikiIngredientsCompareResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], WikiIngredientsCompareResolver);
exports.default = WikiIngredientsCompareResolver;
