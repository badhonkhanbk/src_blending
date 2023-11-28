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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const ProfileRecipe_1 = __importDefault(require("../schemas/ProfileRecipe"));
const ProfileRecipeDesc_1 = __importDefault(require("../schemas/ProfileRecipeDesc"));
const getAllGlobalRecipes_1 = __importDefault(require("./util/getAllGlobalRecipes"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("./util/getNotesCompareAndUserCollection"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const temporaryCompareCollection_1 = __importDefault(require("../../../models/temporaryCompareCollection"));
const checkTemporaryCompareList_1 = __importDefault(require("./util/checkTemporaryCompareList"));
const GetASingleRecipe_1 = __importDefault(require("./util/GetASingleRecipe"));
const RecipesWithPagination_1 = __importDefault(require("../schemas/RecipesWithPagination"));
const MainRecipesWithPagination_1 = __importDefault(require("../schemas/MainRecipesWithPagination"));
const getAllAdminRecipes_1 = __importDefault(require("./util/getAllAdminRecipes"));
let RecipeCorrectionResolver = class RecipeCorrectionResolver {
    async bringAllAdminRecipe() {
        // await RecipeModel.updateMany(
        //   {
        //     adminId: { $ne: null },
        //   },
        //   {
        //     global: true,
        //     userId: null,
        //     addedByAdmin: true,
        //     discovery: true,
        //     isPublished: true,
        //   }
        // );
        let users = await memberModel_1.default.find().select('_id');
        for (let i = 0; i < users.length; i++) {
            await (0, getAllGlobalRecipes_1.default)(String(users[i]._id));
        }
        return 'done';
    }
    async removeNow() {
        let temporaryCompareList = await (0, checkTemporaryCompareList_1.default)('5f9b3b3b1c9d440000f3b0b0');
        return '';
    }
    /**
     * Retrieves the discover recipes for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} The discovered recipes.
     */
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
    // @Query((type) => ProfileRecipeDesc)
    // async viewSharedRecipe(
    //   @Arg('userId') userId: String,
    //   @Arg('token') token: String
    // ) {
    //   const share = await ShareModel.findOne({ _id: token });
    //   if (!share.isGlobal) {
    //     let auth = share.shareTo.filter((sharePerson) => {
    //       return String(sharePerson.userId) === String(userId);
    //     })[0];
    //     console.log(auth);
    //     if (!auth) {
    //       return new AppError('Invalid token', 404);
    //     }
    //   }
    //   if (!share) {
    //     return new AppError('Invalid token', 404);
    //   }
    //   return await makeGlobalRecipe(share, userId.toString());
    // }
    /**
     * Retrieves a single recipe based on the provided recipe ID, user ID, and token.
     *
     * @param {String} recipeId - The ID of the recipe to retrieve. Can be nullable.
     * @param {String} userId - The ID of the user making the request.
     * @param {String} token - The token used for authentication. Can be nullable.
     * @return {Promise} Returns a promise that resolves to the retrieved recipe.
     */
    async getARecipe2(recipeId, userId, token) {
        return await (0, GetASingleRecipe_1.default)(recipeId, userId, token);
    }
    /**
     * Retrieves the compare list for a given user.
     *
     * @param {string} userId - The ID of the user.
     * @return {Array} An array containing the compare list.
     */
    async getCompareList2(userId) {
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: userId,
        }).select('_id');
        if (checkIfNew.length === 0) {
            await (0, getAllGlobalRecipes_1.default)(userId);
        }
        let compareList = await Compare_1.default.find({ userId: userId });
        // console.log(compareList);
        // let temporaryCompareList: any[] =
        //   await TemporaryCompareCollectionModel.find({
        //     userId: userId,
        //   });
        // if (temporaryCompareList.length !== 0) {
        // temporaryCompareList = await checkTemporaryCompareList(userId);
        //   compareList = await CompareModel.find({ userId: userId });
        // }
        // for (let i = 0; i < temporaryCompareList.length; i++) {
        //   compareList.push({ ...temporaryCompareList[i]._doc, isTemp: true });
        // }
        // console.log('c', compareList);
        if (compareList.length === 0) {
            return [];
        }
        // let recipeIds = compareList.map((compareItem) => compareItem.recipeId);
        let userProfileRecipes = [];
        for (let i = 0; i < compareList.length; i++) {
            let checkTemp = await temporaryCompareCollection_1.default.findOne({
                userId: userId,
                recipeId: compareList[i].recipeId,
            });
            if (checkTemp) {
                compareList[i].isTemp = true;
            }
            let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: compareList[i].recipeId,
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
                select: 'mainEntityOfPage name image datePublished recipeBlendCategory brand foodCategories url favicon numberOfRating totalViews averageRating description userId',
            })
                .lean();
            let compareVersion = await RecipeVersionModel_1.default.findOne({
                _id: compareList[i].versionId,
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate({
                path: 'createdBy',
                select: '_id image firstName lastName email',
            });
            // console.log(compareVersion);
            let compareRecipe = {
                recipeId: userProfileRecipe.recipeId,
                defaultVersion: compareVersion,
                turnedOnVersions: userProfileRecipe.turnedOnVersions,
                turnedOffVersions: userProfileRecipe.turnedOffVersions,
                isMatch: false,
                compare: true,
                isTemp: compareList[i].isTemp ? true : false,
            };
            userProfileRecipes.push(compareRecipe);
        }
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        console.log(userProfileRecipes);
        return returnRecipe;
    }
    async getAllrecomendedRecipes2(userId, page, limit) {
        if (!limit) {
            limit = 12;
        }
        if (!page) {
            page = 1;
        }
        let skip = limit * (page - 1);
        skip += 20;
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
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                {
                    path: 'createdBy',
                    select: '_id displayName firstName lastName image email',
                },
            ],
            select: 'postfixTitle selectedImage calorie gigl errorIngredients',
        })
            .limit(limit)
            .skip(skip)
            .lean();
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        // console.log(returnRecipe[0].recipeId);
        return {
            recipes: returnRecipe,
            totalRecipes: (await UserRecipeProfile_1.default.countDocuments({ userId: userId })) - 20,
        };
    }
    async getAllpopularRecipes2(userId, page, limit) {
        if (!limit) {
            limit = 12;
        }
        if (!page) {
            page = 1;
        }
        let skip = limit * (page - 1);
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
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                {
                    path: 'createdBy',
                    select: '_id displayName firstName lastName image email',
                },
            ],
            select: 'postfixTitle selectedImage calorie gigl errorIngredients',
        })
            .limit(limit)
            .skip(skip)
            .lean();
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return {
            recipes: returnRecipe,
            totalRecipes: await UserRecipeProfile_1.default.countDocuments({
                userId: userId,
            }),
        };
    }
    /**
     * Retrieves all the latest recipes for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} The latest recipes for the user.
     */
    async getAllLatestRecipes2(userId, page, limit) {
        if (!limit) {
            limit = 12;
        }
        if (!page) {
            page = 1;
        }
        let skip = limit * (page - 1);
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
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                {
                    path: 'createdBy',
                    select: '_id displayName firstName lastName image email',
                },
            ],
            select: 'postfixTitle selectedImage calorie gigl errorIngredients',
        })
            .limit(limit)
            .skip(skip)
            .sort({ createdAt: -1 })
            .lean();
        // console.log(userProfileRecipes);
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return {
            recipes: returnRecipe,
            totalRecipes: await UserRecipeProfile_1.default.countDocuments({
                userId: userId,
            }),
        };
    }
    async getAllRelatedCategoryRecipes(userId, blendCategory, page, limit) {
        if (!limit) {
            limit = 6;
        }
        if (!page) {
            page = 1;
        }
        let skip = limit * (page - 1);
        let recipes = await recipeModel_1.default.find({
            recipeBlendCategory: blendCategory,
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        })
            .select('_id')
            .lean();
        let recipeIds = recipes.map((recipe) => recipe._id);
        // console.log(recipeIds);
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
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                {
                    path: 'createdBy',
                    select: '_id displayName firstName lastName image email',
                },
            ],
            select: 'postfixTitle selectedImage calorie gigl errorIngredients',
        })
            .limit(limit)
            .skip(skip)
            .lean();
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        // console.log(returnRecipe[0].recipeId);
        return {
            recipes: returnRecipe,
            totalRecipes: await UserRecipeProfile_1.default.countDocuments({
                userId: userId,
                recipeId: {
                    $in: recipeIds,
                },
            }),
        };
    }
    async getAllRecipesForAdmin(page, limit) {
        let recipes = await (0, getAllAdminRecipes_1.default)(limit, page, []);
        return {
            recipes: recipes,
            totalRecipes: await recipeModel_1.default.countDocuments(),
        };
    }
    /**
     * A description of the entire function.
     *
     * @return {Promise<void>} description of return value
     */
    async shanto() {
        await recipeModel_1.default.updateMany({
            recipeBlendCategory: null,
        }, {
            recipeBlendCategory: '61cafd4d668ec5e10720a943',
        });
        return '';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "bringAllAdminRecipe", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "removeNow", null);
__decorate([
    (0, type_graphql_1.Query)((type) => String)
    /**
     * Retrieves the discover recipes for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} The discovered recipes.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getDiscoverRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => ProfileRecipeDesc_1.default)
    /**
     * Retrieves a single recipe based on the provided recipe ID, user ID, and token.
     *
     * @param {String} recipeId - The ID of the recipe to retrieve. Can be nullable.
     * @param {String} userId - The ID of the user making the request.
     * @param {String} token - The token used for authentication. Can be nullable.
     * @return {Promise} Returns a promise that resolves to the retrieved recipe.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getARecipe2", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ProfileRecipe_1.default])
    /**
     * Retrieves the compare list for a given user.
     *
     * @param {string} userId - The ID of the user.
     * @return {Array} An array containing the compare list.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getCompareList2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllrecomendedRecipes2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllpopularRecipes2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default)
    /**
     * Retrieves all the latest recipes for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} The latest recipes for the user.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllLatestRecipes2", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('blendCategory')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllRelatedCategoryRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => MainRecipesWithPagination_1.default) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "getAllRecipesForAdmin", null);
__decorate([
    (0, type_graphql_1.Query)((type) => String)
    /**
     * A description of the entire function.
     *
     * @return {Promise<void>} description of return value
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCorrectionResolver.prototype, "shanto", null);
RecipeCorrectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCorrectionResolver);
exports.default = RecipeCorrectionResolver;
