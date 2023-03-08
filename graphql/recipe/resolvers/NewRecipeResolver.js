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
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const util_1 = __importDefault(require("../../share/util"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const ProfileRecipe_1 = __importDefault(require("../schemas/ProfileRecipe"));
const ProfileRecipeDesc_1 = __importDefault(require("../schemas/ProfileRecipeDesc"));
const getAllGlobalRecipes_1 = __importDefault(require("./util/getAllGlobalRecipes"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("./util/getNotesCompareAndUserCollection"));
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
            await (0, getAllGlobalRecipes_1.default)(userId);
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
            select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId',
        })
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
        });
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
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
            select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating description userId userId',
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
            await (0, getAllGlobalRecipes_1.default)(userId);
        }
        const compareList = await Compare_1.default.find({ userId: userId });
        let userProfileRecipes = [];
        for (let i = 0; i < compareList.length; i++) {
            let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: compareList[i].recipeId,
            }).populate({
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
                select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating description userId userId',
            });
            console.log(compareList[i].versionId);
            let compareVersion = await RecipeVersionModel_1.default.findOne({
                _id: compareList[i].versionId,
            }).populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            });
            let compareRecipe = {
                recipeId: userProfileRecipe.recipeId,
                defaultVersion: compareVersion,
                turnedOnVersions: userProfileRecipe.turnedOnVersions,
                turnedOffVersions: userProfileRecipe.turnedOffVersions,
                isMatch: false,
                compare: true,
            };
            userProfileRecipes.push(compareRecipe);
        }
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getAllrecomendedRecipes2(userId) {
        // let checkIfNew = await UserRecipeProfileModel.find({
        //   userId: userId,
        // }).select('_id');
        // if (checkIfNew.length === 0) {
        //   await bringAllGlobalRecipes(userId);
        // }
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
            select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId',
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
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        // console.log(returnRecipe[0].recipeId);
        return returnRecipe;
    }
    async getAllpopularRecipes2(userId) {
        // let checkIfNew = await UserRecipeProfileModel.find({
        //   userId: userId,
        // }).select('_id');
        // if (checkIfNew.length === 0) {
        //   await bringAllGlobalRecipes(userId);
        // }
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
            select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId',
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
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getAllLatestRecipes2(userId) {
        // let checkIfNew = await UserRecipeProfileModel.find({
        //   userId: userId,
        // }).select('_id');
        // if (checkIfNew.length === 0) {
        //   await bringAllGlobalRecipes(userId);
        // }
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
            select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating userId',
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
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return returnRecipe;
    }
    // async bringAllGlobalRecipes(userId: String) {
    //   let recipes: any[] = await NewRecipeModel.find({
    //     global: true,
    //     userId: null,
    //     addedByAdmin: true,
    //     discovery: true,
    //     isPublished: true,
    //   });
    //   for (let i = 0; i < recipes.length; i++) {
    //     await UserRecipeProfileModel.create({
    //       recipeId: recipes[i]._id,
    //       userId: userId,
    //       isMatch: recipes[i].isMatch,
    //       allRecipes: false,
    //       myRecipes: false,
    //       turnedOffVersions: recipes[i].turnedOffVersion,
    //       turnedOnVersions: recipes[i].turnedOnVersions,
    //       defaultVersion: recipes[i].defaultVersion,
    //     });
    //   }
    // }
    async turnedOnOrOffVersion(userId, recipeId, versionId, turnedOn) {
        let newUpdatedRecipe = {};
        if (turnedOn) {
            newUpdatedRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                userId: userId,
                recipeId: recipeId,
            }, {
                $pull: {
                    turnedOffVersions: versionId,
                },
                $push: {
                    turnedOnVersions: versionId,
                },
            }, {
                new: true,
            });
        }
        else {
            newUpdatedRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                userId: userId,
                recipeId: recipeId,
            }, {
                $pull: {
                    turnedOnVersions: versionId,
                },
                $push: {
                    turnedOffVersions: versionId,
                },
            }, {
                new: true,
            });
        }
        return 'Success';
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
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('versionId')),
    __param(3, (0, type_graphql_1.Arg)('turnedOn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "turnedOnOrOffVersion", null);
RecipeCorrectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCorrectionResolver);
exports.default = RecipeCorrectionResolver;
