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
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const util_1 = __importDefault(require("../../share/util"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const ProfileRecipe_1 = __importDefault(require("../schemas/ProfileRecipe"));
const ProfileRecipeDesc_1 = __importDefault(require("../schemas/ProfileRecipeDesc"));
//**
//*
//* @param recipeId
//* @returns
//*
let RecipeCorrectionResolver = class RecipeCorrectionResolver {
    async getDiscoverRecipes(userId) {
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await this.bringAllGlobalRecipes(userId);
        }
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
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
                select: 'ingredientName',
            },
            select: 'postfixTitle',
        });
        let returnRecipe = await this.getNotesCompareAndUserCollection(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getARecipe2(recipeId, userId, token) {
        if (token) {
            let data = await (0, util_1.default)(token.toString(), userId.toString());
            if (!data) {
                return new AppError_1.default('Invalid token', 404);
            }
            else {
                return data;
            }
        }
        if (!recipeId) {
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
                    path: 'originalVersion',
                    model: 'RecipeVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                    },
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
            path: 'turnedOnVersions',
            model: 'RecipeVersion',
            select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
            options: { sort: { isDefault: -1 } },
        })
            .populate({
            path: 'turnedOffVersions',
            model: 'RecipeVersion',
            select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
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
        return {
            ...userProfileRecipe._doc,
            notes: userNotes.length,
            addedToCompare: addedToCompare,
            userCollections: collectionData,
            versionsCount: versionsCount,
        };
    }
    async getCompareList2(userId) {
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await this.bringAllGlobalRecipes(userId);
        }
        const compareList = await Compare_1.default.find({ userId: userId });
        let recipeIds = compareList.map((compareData) => compareData.recipeId);
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
            recipeId: { $in: recipeIds },
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
                select: 'ingredientName',
            },
            select: 'postfixTitle',
        });
        let returnRecipe = await this.getNotesCompareAndUserCollection(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getAllrecomendedRecipes2(userId) {
        // await NewRecipeModel.deleteMany();
        await UserRecipeProfile_1.default.deleteMany();
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await this.bringAllGlobalRecipes(userId);
        }
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
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
                select: 'ingredientName',
            },
            select: 'postfixTitle',
        })
            .limit(20);
        let returnRecipe = await this.getNotesCompareAndUserCollection(userId, userProfileRecipes);
        // console.log(returnRecipe[0].recipeId);
        return returnRecipe;
    }
    async getAllpopularRecipes2(userId) {
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await this.bringAllGlobalRecipes(userId);
        }
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
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
                select: 'ingredientName',
            },
            select: 'postfixTitle',
        })
            .skip(10)
            .limit(20);
        let returnRecipe = await this.getNotesCompareAndUserCollection(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getAllLatestRecipes2(userId) {
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await this.bringAllGlobalRecipes(userId);
        }
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
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
                select: 'ingredientName',
            },
            select: 'postfixTitle',
        })
            .skip(8)
            .limit(10);
        let returnRecipe = await this.getNotesCompareAndUserCollection(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getNotesCompareAndUserCollection(userId, userProfileRecipes) {
        let returnRecipe = [];
        let collectionRecipes = [];
        let member = await memberModel_1.default.findOne({ _id: userId })
            .populate({
            path: 'collections',
            model: 'UserCollection',
            select: 'recipes',
        })
            .select('-_id collections');
        // console.log(member.collections);
        for (let i = 0; i < member.collections.length; i++) {
            let items = member.collections[i].recipes.map(
            //@ts-ignore
            (recipe) => {
                return {
                    recipeId: String(recipe),
                    recipeCollection: String(member.collections[i]._id),
                };
            });
            collectionRecipes.push(...items);
        }
        for (let i = 0; i < userProfileRecipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: userProfileRecipes[i].recipeId._id,
                userId: userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: userId,
                recipeId: userProfileRecipes[i].recipeId._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => String(recipeData.recipeId) ===
                String(userProfileRecipes[i].recipeId._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            let versionsCount = 0;
            versionsCount +=
                +userProfileRecipes[i].turnedOnVersions.length +
                    +userProfileRecipes[i].turnedOffVersions.length;
            if (!userProfileRecipes[i].isMatch) {
                versionsCount++;
            }
            returnRecipe.push({
                ...userProfileRecipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
                versionCount: versionsCount,
            });
        }
        return returnRecipe;
    }
    async bringAllGlobalRecipes(userId) {
        let recipes = await recipeModel_1.default.find({
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        });
        for (let i = 0; i < recipes.length; i++) {
            await UserRecipeProfile_1.default.create({
                recipeId: recipes[i]._id,
                userId: userId,
                isMatch: recipes[i].isMatch,
                allRecipes: false,
                myRecipes: false,
                turnedOffVersions: recipes[i].turnedOffVersion,
                turnedOnVersions: recipes[i].turnedOnVersions,
                defaultVersion: recipes[i].defaultVersion,
            });
        }
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getDiscoverRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => ProfileRecipeDesc_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getARecipe2", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ProfileRecipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getCompareList2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [ProfileRecipe_1.default]) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllrecomendedRecipes2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [ProfileRecipe_1.default]) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllpopularRecipes2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [ProfileRecipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllLatestRecipes2", null);
RecipeCorrectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCorrectionResolver);
exports.default = RecipeCorrectionResolver;
