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
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const RecipeFacts_1 = __importDefault(require("../../../models/RecipeFacts"));
const recipeOriginalFactModel_1 = __importDefault(require("../../../models/recipeOriginalFactModel"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const scrappedRecipe_1 = __importDefault(require("../../../models/scrappedRecipe"));
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
const SimpleRecipe_1 = __importDefault(require("../../recipe/schemas/SimpleRecipe"));
const CreateRecipe_1 = __importDefault(require("./input-type/CreateRecipe"));
const EditRecipe_1 = __importDefault(require("./input-type/EditRecipe"));
const GetAllRecipesByBlendCategory_1 = __importDefault(require("./input-type/GetAllRecipesByBlendCategory"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const Hello_1 = __importDefault(require("../schemas/Hello"));
const updateVersionFacts_1 = __importDefault(require("./util/updateVersionFacts"));
const filterRecipe_1 = __importDefault(require("./input-type/filterRecipe"));
const updateOriginalVersionFact_1 = __importDefault(require("./util/updateOriginalVersionFact"));
const util_1 = __importDefault(require("../../share/util"));
const CreateScrappedRecipe_1 = __importDefault(require("./input-type/CreateScrappedRecipe"));
const RecipesWithPagination_1 = __importDefault(require("../schemas/RecipesWithPagination"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("./util/getNotesCompareAndUserCollection"));
const ProfileRecipe_1 = __importDefault(require("../schemas/ProfileRecipe"));
const QANotFound_1 = __importDefault(require("../../../models/QANotFound"));
const brand_1 = __importDefault(require("../../../models/brand"));
const slugify_1 = __importDefault(require("slugify"));
let RecipeResolver = class RecipeResolver {
    // @Query((type) => String)
    // async tya() {
    //   let recipeVersions = await RecipeVersionModel.find();
    //   for (let i = 0; i < recipeVersions.length; i++) {
    //     console.log(i);
    //     let recipe: any = await RecipeModel.findById(
    //       recipeVersions[i].recipeId
    //     ).select('image');
    //     if (!recipe) {
    //       console.log(recipeVersions[i].recipeId);
    //       console.log(recipeVersions[i]._id);
    //       continue;
    //     }
    //     if (recipe.image.length === 0) {
    //       await RecipeVersionModel.findByIdAndUpdate(recipeVersions[i]._id, {
    //         selectedImage: '',
    //       });
    //     } else {
    //       await RecipeVersionModel.findByIdAndUpdate(recipeVersions[i]._id, {
    //         selectedImage: recipe.image[0].image ? recipe.image[0].image : '',
    //       });
    //     }
    //   }
    //   return 'done';
    // }
    async getCompareList(userId) {
        const compareList = await Compare_1.default.find({ userId: userId }).populate({
            path: 'recipeId',
            model: 'RecipeModel',
            populate: [
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                },
                {
                    path: 'defaultVersion',
                    model: 'RecipeVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName selectedImage',
                    },
                    select: 'postfixTitle selectedImage',
                },
                {
                    path: 'userId',
                    model: 'User',
                    select: '_id displayName image firstName lastName email',
                },
            ],
        });
        let recipes = compareList.map((compareData) => compareData.recipeId);
        let returnRecipe = [];
        let collectionRecipes = [];
        let memberCollection = await memberModel_1.default.findOne({ _id: userId })
            .populate({
            path: 'collections',
            model: 'UserCollection',
            select: 'recipes',
        })
            .select('-_id collections');
        for (let i = 0; i < memberCollection.collections.length; i++) {
            //@ts-ignore
            let items = memberCollection.collections[i].recipes.map(
            //@ts-ignore
            (recipe) => {
                return {
                    recipeId: String(recipe._id),
                    recipeCollection: String(memberCollection.collections[i]._id),
                };
            });
            collectionRecipes.push(...items);
        }
        for (let i = 0; i < recipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: recipes[i]._id,
                userId: userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: userId,
                recipeId: recipes[i]._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            returnRecipe.push({
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    async getAllRecipesByBlendCategory(data) {
        let recipes;
        //@ts-ignore
        if (data.includeIngredientIds.length > 0) {
            recipes = await recipeModel_1.default.find({
                global: true,
                userId: null,
                addedByAdmin: true,
                discovery: true,
                isPublished: true,
                recipeBlendCategory: { $in: data.blendTypes },
                'ingredients.ingredientId': { $in: data.includeIngredientIds },
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                populate: {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                select: 'postfixTitle selectedImage',
            })
                .populate({
                path: 'userId',
                model: 'User',
                select: '_id displayName image firstName lastName email',
            })
                .populate('brand')
                .populate('recipeBlendCategory');
        }
        else {
            recipes = await recipeModel_1.default.find({
                global: true,
                userId: null,
                addedByAdmin: true,
                discovery: true,
                isPublished: true,
                recipeBlendCategory: { $in: data.blendTypes },
            })
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                populate: {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                select: 'postfixTitle',
            })
                .populate({
                path: 'userId',
                model: 'User',
                select: '_id displayName image firstName lastName email',
            })
                .populate('brand')
                .populate('recipeBlendCategory');
        }
        let returnRecipe = [];
        let collectionRecipes = [];
        let memberCollection = await memberModel_1.default.findOne({ _id: data.userId })
            .populate({
            path: 'collections',
            model: 'UserCollection',
            select: 'recipes',
        })
            .select('-_id collections');
        for (let i = 0; i < memberCollection.collections.length; i++) {
            //@ts-ignore
            let items = memberCollection.collections[i].recipes.map(
            //@ts-ignore
            (recipe) => {
                return {
                    recipeId: String(recipe._id),
                    recipeCollection: String(memberCollection.collections[i]._id),
                };
            });
            collectionRecipes.push(...items);
        }
        for (let i = 0; i < recipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: recipes[i]._id,
                userId: data.userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: data.userId,
                recipeId: recipes[i]._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            returnRecipe.push({
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    //CHECK:
    async getAllRecipes(userId) {
        if (userId) {
            const recipes = await recipeModel_1.default.find({})
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                populate: {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                select: 'postfixTitle',
            })
                .populate('brand')
                .populate('recipeBlendCategory');
            let returnRecipe = [];
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
            for (let i = 0; i < recipes.length; i++) {
                let userNotes = await userNote_1.default.find({
                    recipeId: recipes[i]._id,
                    userId: userId,
                });
                let addedToCompare = false;
                let compare = await Compare_1.default.findOne({
                    userId: userId,
                    recipeId: recipes[i]._id,
                });
                if (compare) {
                    addedToCompare = true;
                }
                let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
                if (collectionData.length === 0) {
                    collectionData = null;
                }
                else {
                    //@ts-ignore
                    collectionData = collectionData.map((data) => data.recipeCollection);
                }
                returnRecipe.push({
                    //@ts-ignore
                    ...recipes[i]._doc,
                    notes: userNotes.length,
                    addedToCompare: addedToCompare,
                    userCollections: collectionData,
                });
            }
            return returnRecipe;
        }
        else {
            const recipes = await recipeModel_1.default.find()
                .populate({
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                populate: {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName selectedImage',
                },
                select: 'postfixTitle',
            })
                .populate({
                path: 'userId',
                model: 'User',
                select: '_id displayName image firstName lastName email',
            })
                .populate('brand')
                .populate('recipeBlendCategory');
            return recipes;
        }
    }
    async getAllrecomendedRecipes(userId) {
        const recipes = await recipeModel_1.default.find({
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        })
            .sort({ totalRating: 1 })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName',
        })
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
                select: 'ingredientName',
            },
            select: 'postfixTitle selectedImage',
        })
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .limit(20);
        let returnRecipe = [];
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
        for (let i = 0; i < recipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: recipes[i]._id,
                userId: userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: userId,
                recipeId: recipes[i]._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            returnRecipe.push({
                //@ts-ignore
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    async getAllpopularRecipes(userId) {
        const recipes = await recipeModel_1.default.find({
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        })
            .limit(15)
            .sort({ averageRating: -1 })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName',
        })
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
                select: 'ingredientName',
            },
            select: 'postfixTitle selectedImage',
        })
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
        })
            .populate('brand')
            .populate('recipeBlendCategory');
        let returnRecipe = [];
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
        for (let i = 0; i < recipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: recipes[i]._id,
                userId: userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: userId,
                recipeId: recipes[i]._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            returnRecipe.push({
                //@ts-ignore
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    async searchRecipes(searchTerm, userId, page, limit) {
        if (searchTerm.trim() === '') {
            return {
                recipes: [],
                totalRecipes: 0,
            };
        }
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        let recipes = await recipeModel_1.default.find({
            // global: true,
            // userId: null,
            // addedByAdmin: true,
            // discovery: true,
            // isPublished: true,
            name: { $regex: searchTerm, $options: 'i' },
        }).select('_id');
        let recipeIds = recipes.map((recipe) => recipe._id);
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
                select: 'ingredientName selectedImage',
            },
            select: 'postfixTitle selectedImage',
        })
            .limit(limit)
            .skip(limit * (page - 1));
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        let userProfileRecipesTotalCount = await UserRecipeProfile_1.default.countDocuments({
            userId: userId,
            recipeId: {
                $in: recipeIds,
            },
        });
        return {
            recipes: returnRecipe,
            totalRecipes: userProfileRecipesTotalCount,
        };
    }
    async getAllLatestRecipes(userId) {
        const recipes = await recipeModel_1.default.find({
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        })
            .sort({ createdAt: -1 })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName',
        })
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
                select: 'ingredientName',
            },
            select: 'postfixTitle selectedImage',
        })
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .limit(10);
        let returnRecipe = [];
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
        for (let i = 0; i < recipes.length; i++) {
            let userNotes = await userNote_1.default.find({
                recipeId: recipes[i]._id,
                userId: userId,
            });
            let addedToCompare = false;
            let compare = await Compare_1.default.findOne({
                userId: userId,
                recipeId: recipes[i]._id,
            });
            if (compare) {
                addedToCompare = true;
            }
            let collectionData = collectionRecipes.filter((recipeData) => recipeData.recipeId === String(recipes[i]._id));
            if (collectionData.length === 0) {
                collectionData = null;
            }
            else {
                //@ts-ignore
                collectionData = collectionData.map((data) => data.recipeCollection);
            }
            returnRecipe.push({
                //@ts-ignore
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    async getARecipe(recipeId, userId, token) {
        if (token) {
            if (!userId) {
                return new AppError_1.default('User not found', 404);
            }
            else {
                let data = await (0, util_1.default)(token.toString(), userId.toString());
                if (!data) {
                    return new AppError_1.default('Invalid token', 404);
                }
                else {
                    return data;
                }
            }
        }
        if (!recipeId) {
            return new AppError_1.default('Recipe not found', 404);
        }
        const recipe = await recipeModel_1.default.findById(recipeId)
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient selectedImage',
            },
        })
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
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
            path: 'recipeVersion',
            model: 'RecipeVersion',
            select: '_id postfixTitle description createdAt updatedAt isDefault isOriginal',
            options: { sort: { isDefault: -1 } },
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
        return {
            //@ts-ignore
            ...recipe._doc,
            notes: userNotes.length,
            addedToCompare: addedToCompare,
            userCollections: collectionData,
        };
    }
    async getARecipeForAdmin(recipeId) {
        const recipe = await recipeModel_1.default.findById(recipeId)
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        })
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipe;
    }
    async editARecipe(data, userId) {
        let recipe = await recipeModel_1.default.findOne({ _id: data.editId });
        if (String(recipe.userId) === userId) {
            let willBeModifiedData = data.editableObject;
            await recipeModel_1.default.findOneAndUpdate({ _id: data.editId }, willBeModifiedData);
            return 'recipe updated successfully';
        }
        else {
            return new AppError_1.default('You are not authorized to edit this recipe', 401);
        }
    }
    async deleteARecipe(recipeId, userId) {
        let user = await memberModel_1.default.findOne({ _id: userId }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        for (let k = 0; k < user.collections.length; k++) {
            await userCollection_1.default.findOneAndUpdate({ _id: user.collections[k] }, { $pull: { recipes: recipe._id } });
        }
        await Compare_1.default.findOneAndRemove({
            userId: userId,
            recipeId: recipe._id,
        });
        if (String(recipe.userId) === String(userId)) {
            await recipeModel_1.default.findOneAndRemove({ _id: recipeId });
            await RecipeVersionModel_1.default.deleteMany({
                _id: {
                    $in: recipe.recipeVersion,
                },
            });
            await RecipeFacts_1.default.deleteMany({
                versionId: {
                    $in: recipe.recipeVersion,
                },
            });
            return 'recipe deleted successfully and releted versions';
        }
        return 'recipe has been removed From your collection';
    }
    async addRecipeFromAdmin(data) {
        let newData = data;
        newData.foodCategories = [];
        for (let i = 0; i < newData.ingredients.length; i++) {
            newData.ingredients[i].portions = [];
            let ingredient = await blendIngredient_1.default.findOne({
                _id: newData.ingredients[i].ingredientId,
            });
            let index = 0;
            let selectedPortionIndex = 0;
            for (let j = 0; j < ingredient.portions.length; j++) {
                if (ingredient.portions[j].default === true) {
                    index = j;
                    console.log(index);
                    break;
                }
            }
            for (let k = 0; k < ingredient.portions.length; k++) {
                if (ingredient.portions[k].measurement ===
                    newData.ingredients[i].selectedPortionName) {
                    selectedPortionIndex = k;
                }
                let portion = {
                    name: ingredient.portions[k].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[k].meausermentWeight,
                    default: ingredient.portions[k].default,
                    gram: ingredient.portions[k].meausermentWeight,
                };
                newData.ingredients[i].portions.push(portion);
            }
            newData.ingredients[i].selectedPortion = {
                name: ingredient.portions[selectedPortionIndex].measurement,
                quantity: newData.ingredients[i].weightInGram /
                    +ingredient.portions[selectedPortionIndex].meausermentWeight,
                gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
            };
            newData.foodCategories.push(ingredient.category);
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        let recipe = await recipeModel_1.default.create(newData);
        return 'recipe added successfully';
    }
    async addRecipeFromUser(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let userDefaultCollection;
        if (data.collection) {
            userDefaultCollection = data.collection;
        }
        else {
            userDefaultCollection = user.lastModifiedCollection
                ? user.defaultCollection
                : user.lastModifiedCollection;
        }
        let newData = data;
        newData.foodCategories = [];
        if (newData.ingredients) {
            for (let i = 0; i < newData.ingredients.length; i++) {
                newData.ingredients[i].portions = [];
                let ingredient = await blendIngredient_1.default.findOne({
                    _id: newData.ingredients[i].ingredientId,
                });
                let index = 0;
                let selectedPortionIndex = 0;
                for (let j = 0; j < ingredient.portions.length; j++) {
                    if (ingredient.portions[j].default === true) {
                        index = j;
                        console.log(index);
                        break;
                    }
                }
                for (let k = 0; k < ingredient.portions.length; k++) {
                    if (ingredient.portions[k].measurement ===
                        newData.ingredients[i].selectedPortionName) {
                        selectedPortionIndex = k;
                    }
                    let portion = {
                        name: ingredient.portions[k].measurement,
                        quantity: newData.ingredients[i].weightInGram /
                            +ingredient.portions[k].meausermentWeight,
                        default: ingredient.portions[k].default,
                        gram: ingredient.portions[k].meausermentWeight,
                    };
                    newData.ingredients[i].portions.push(portion);
                }
                newData.ingredients[i].selectedPortion = {
                    name: ingredient.portions[selectedPortionIndex].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[selectedPortionIndex].meausermentWeight,
                    gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
                };
                newData.foodCategories.push(ingredient.category);
            }
        }
        else {
            newData.ingredients = [];
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        newData.userId = user._id;
        let domain = new URL(newData.url).toString();
        let brandName = domain.replace('www.', '');
        brandName = domain.replace('.com', '');
        let brand = await brand_1.default.findOne({
            brandName: brandName,
        });
        if (brand) {
            newData.brand = brand._id;
        }
        else {
            let brandInfo = {
                brandUrl: domain,
                slug: (0, slugify_1.default)(brandName),
                brandName: brandName,
                brandIcon: data.favicon,
                canonicalURL: data.seoCanonicalURL,
            };
            let newBrand = await brand_1.default.create(brandInfo);
            newData.brand = newBrand._id;
        }
        let userRecipe = await recipeModel_1.default.create(newData);
        await userCollection_1.default.findOneAndUpdate({ _id: userDefaultCollection }, { $push: { recipes: userRecipe._id } });
        let recipeVersion = await RecipeVersionModel_1.default.create({
            recipeId: userRecipe._id,
            postfixTitle: data.name,
            selectedImage: data.image[0].image,
            servingSize: newData.servingSize,
            description: newData.description,
            ingredients: newData.ingredients,
            recipeInstructions: newData.recipeInstructions,
            createdBy: data.userId,
            errorIngredients: data.errorIngredients,
            isDefault: true,
            isOriginal: true,
        });
        //@ts-ignore
        await (0, updateOriginalVersionFact_1.default)(recipeVersion._id);
        if (data.errorIngredients) {
            if (data.errorIngredients.length > 0) {
                for (let i = 0; i < data.errorIngredients.length; i++) {
                    await QANotFound_1.default.findOneAndUpdate({
                        _id: data.errorIngredients[i].qaId,
                    }, {
                        $push: { versions: recipeVersion._id },
                    });
                }
            }
        }
        await recipeModel_1.default.findOneAndUpdate({
            _id: userRecipe._id,
        }, {
            $push: { recipeVersion: recipeVersion._id },
            originalVersion: recipeVersion._id,
            defaultVersion: recipeVersion._id,
        });
        let returnUserRecipe = await recipeModel_1.default.findOne({ _id: userRecipe._id })
            .populate('recipeBlendCategory')
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        })
            .populate([
            {
                path: 'defaultVersion',
                model: 'RecipeVersion',
                populate: {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName',
                },
                select: 'postfixTitle selectedImage',
            },
            {
                path: 'userId',
                model: 'User',
                select: '_id displayName image firstName lastName email',
            },
        ])
            .populate('brand');
        await UserRecipeProfile_1.default.create({
            userId: data.userId,
            recipeId: returnUserRecipe._id,
            defaultVersion: returnUserRecipe.defaultVersion._id,
            isMatch: true,
            allRecipe: true,
            myRecipes: true,
        });
        return returnUserRecipe;
    }
    // @Mutation((type) => String)
    // async addScrappedRecipeFromUser(@Arg('data') data: CreateScrappedRecipe) {
    //   let ingredientsShape: any = [
    //     {
    //       recipeIngredients: data.recipeIngredients,
    //     },
    //   ];
    //   var dataX = JSON.stringify(ingredientsShape);
    //   var config = {
    //     method: 'get',
    //     url: 'http://54.91.110.31/parse-ingredients',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     data: dataX,
    //   };
    //   let res = await axios(config);
    //   let blends: any[] = [];
    //   let notBlends: any[] = [];
    //   let portionsProblem: any[] = [];
    //   console.log(res.data[0].parsed_data[0].best_match);
    //   for (let i = 0; i < res.data[0].parsed_data.length; i++) {
    //     let blendIngredient: any = null;
    //     for (let j = 0; j < res.data[0].parsed_data[i].best_match.length; j++) {
    //       blendIngredient = await BlendIngredientModel.findOne({
    //         srcFoodReference:
    //           res.data[0].parsed_data[i].best_match[j].db_ingredient_id,
    //         $or: [
    //           {
    //             blendStatus: 'Active',
    //           },
    //           {
    //             blendStatus: 'Review',
    //           },
    //         ],
    //       }).select('-blendNutrients -notBlendNutrients');
    //       if (blendIngredient) {
    //         // console.log(blendIngredient);
    //         break;
    //       }
    //     }
    //     if (!blendIngredient) {
    //       notBlends.push(res.data[0].parsed_data[i]);
    //     } else {
    //       // console.log('blend', blendIngredient, res.data[0].parsed_data[i]);
    //       blends.push({
    //         ingredientId: blendIngredient._id,
    //         quantity: res.data[0].parsed_data[i].QUANTITY,
    //         unit: res.data[0].parsed_data[i].QUANTITY_UNIT,
    //         name: res.data[0].parsed_data[i].INGREDIENT,
    //         db_name: blendIngredient.ingredientName,
    //         comment: res.data[0].parsed_data[i].COMMENT,
    //         portions: blendIngredient.portions,
    //       });
    //     }
    //   }
    //   const parseFraction = (fraction) => {
    //     const [numerator, denominator] = fraction.split('/').map(Number);
    //     return numerator / denominator;
    //   };
    //   for (let i = 0; i < blends.length; i++) {
    //     for (let j = 0; j < blends[i].portions.length; j++) {
    //       if (blends[i].unit === blends[i].portions[j].measurement) {
    //         blends[i].value =
    //           blends[i].quantity * blends[i].portions[j].meausermentWeight;
    //         blends[i].unit = 'g';
    //         if (!blends[i].value) {
    //           blends[i].value =
    //             parseFraction(blends[i].quantity) *
    //             blends[i].portions[j].meausermentWeight;
    //         }
    //       }
    //     }
    //     if (!blends[i].value) {
    //       if (!+blends[i].quantity) {
    //         let converted: any = converter(
    //           parseFraction(blends[i].quantity),
    //           blends[i].unit,
    //           blends[i].portions[0].measurement
    //         );
    //         if (converted.error) {
    //           blends[i].error = converted.error;
    //           portionsProblem.push(blends[i]);
    //           continue;
    //         }
    //         blends[i].value =
    //           converted.quantity * blends[i].portions[0].meausermentWeight;
    //       } else {
    //         let converted: any = converter(
    //           blends[i].quantity,
    //           blends[i].unit,
    //           blends[i].portions[0].measurement
    //         );
    //         if (converted.error) {
    //           blends[i].error = converted.error;
    //           portionsProblem.push(blends[i]);
    //           continue;
    //         }
    //         blends[i].value =
    //           converted.quantity * blends[i].portions[0].meausermentWeight;
    //       }
    //     }
    //   }
    //   blends = blends
    //     .filter((blend: any) => blend.value)
    //     .map((blend: any) => {
    //       return {
    //         ingredientId: blend.ingredientId,
    //         value: blend.value,
    //       };
    //     });
    //   // let mydata = await this.
    //   return 'recipe added successfully';
    // }
    async removeAllBulkRecipe() {
        await scrappedRecipe_1.default.deleteMany();
        return 'removed';
    }
    async addBulkScrappedRecipeFromUser(data) {
        // let user = await MemberModel.findOne({ email: data[0].userId });
        // if (!user) {
        //   return new AppError('User not found', 404);
        // }
        for (let i = 0; i < data.length; i++) {
            let modified = data[i];
            modified.isBulk = true;
            await scrappedRecipe_1.default.create(modified);
        }
        return 'recipe added successfully';
    }
    async CheckScrappedRecipeFromUser(url) {
        let scrappedRecipe = await scrappedRecipe_1.default.findOne({
            url: url,
        });
        if (scrappedRecipe) {
            return true;
        }
        else {
            return false;
        }
    }
    async getA() {
        let recipes = await recipeModel_1.default.find();
        for (let i = 0; i < recipes.length; i++) {
            //@ts-ignore
            let recipeVersion = recipes[i].recipeVersion[0];
            await RecipeVersionModel_1.default.findOneAndUpdate({ _id: recipeVersion }, {
                postfixTitle: recipes[i].name,
            });
            await recipeModel_1.default.findOneAndUpdate({ _id: recipes[i]._id }, {
                originalVersion: recipeVersion,
                defaultVersion: recipeVersion,
            });
        }
        return 'done';
    }
    async getAllRecipesBasedOnIngredient(ingredientId) {
        let recipes = await recipeModel_1.default.find({
            'ingredients.ingredientId': new mongoose_1.default.mongo.ObjectId(ingredientId),
        })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
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
            .populate('brand')
            .populate('recipeBlendCategory');
        return recipes;
    }
    async getAllMyCreatedRecipes(userId) {
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
            myRecipes: true,
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
                select: 'ingredientName',
            },
            select: 'postfixTitle selectedImage',
        })
            .limit(20);
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        // console.log(returnRecipe[0].recipeId);
        return returnRecipe;
    }
    async addMacroInfo() {
        let recipes = await recipeModel_1.default.find().select('userId');
        // for (let i = 0; i < recipes.length; i++) {
        //   console.log(recipes[i])
        // }
        const modifiedRecipe = recipes.reduce((acc, data) => {
            console.log(data);
            let index = acc.findIndex(
            //@ts-ignore
            (recipe) => String(recipe.userId) === String(data.userId));
            console.log(index);
            if (index === -1) {
                acc.push({
                    userId: data.userId,
                    recipes: [data._id],
                    count: 1,
                });
            }
            else {
                acc[index].recipes.push(data._id);
                acc[index].count++;
            }
            return acc;
        }, []);
        console.log(modifiedRecipe);
        return modifiedRecipe;
    }
    async populateAllRecipeFacts() {
        let versions = await RecipeVersionModel_1.default.find().select('_id');
        for (let i = 0; i < versions.length; i++) {
            //@ts-ignore
            await (0, updateVersionFacts_1.default)(versions[i]._id);
        }
        return 'done';
    }
    async populateAllOriginalRecipeFacts() {
        let versions = await RecipeVersionModel_1.default.find().select('_id');
        for (let i = 0; i < versions.length; i++) {
            //@ts-ignore
            await (0, updateOriginalVersionFact_1.default)(versions[i]._id);
        }
        return 'done';
    }
    async removeAllVersionFacts() {
        await RecipeFacts_1.default.deleteMany({});
        return 'done';
    }
    async filterRecipe(data, userId, page, limit) {
        if (
        //@ts-ignore
        data.blendTypes.length == 0 &&
            //@ts-ignore
            data.includeIngredientIds.length == 0 &&
            //@ts-ignore
            data.nutrientFilters.length == 0 &&
            //@ts-ignore
            data.nutrientMatrix.length == 0 &&
            //@ts-ignore
            data.excludeIngredientIds.length == 0) {
            return {
                recipes: [],
                totalRecipes: 0,
            };
        }
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        let recipeData = [];
        let find = {
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        };
        //@ts-ignore
        if (data.blendTypes.length > 0) {
            find = {
                recipeBlendCategory: { $in: data.blendTypes },
            };
        }
        if (data.includeIngredientIds.length > 0) {
            find = {
                'ingredients.ingredientId': { $in: data.includeIngredientIds },
            };
        }
        let findKeys = Object.keys(find);
        if (findKeys.length > 0) {
            console.log(find);
            recipeData = await recipeModel_1.default.find(find).select('_id');
        }
        else {
            recipeData = [];
        }
        console.log('hello');
        if (recipeData.length > 0 && data.excludeIngredientIds.length > 0) {
            let recipeIds = recipeData.map((recipe) => recipe._id);
            recipeData = await recipeModel_1.default.find({
                _id: { $in: recipeIds },
                'ingredients.ingredientId': { $nin: data.excludeIngredientIds },
            }).select('_id');
        }
        let findfacts = {
            global: true,
            userId: null,
            addedByAdmin: true,
            discovery: true,
            isPublished: true,
        };
        if (recipeData.length > 0) {
            let recipeIds = recipeData.map((recipe) => recipe._id);
            findfacts = {
                recipeId: { $in: recipeIds },
            };
        }
        else {
            findfacts = {
                recipeId: { $in: [] },
            };
        }
        for (let i = 0; i < data.nutrientMatrix.length; i++) {
            let val = '';
            if (data.nutrientMatrix[i].matrixName === 'netCarbs') {
                val = 'gigl.netCarbs';
                findfacts[val] = {};
            }
            else if (data.nutrientMatrix[i].matrixName === 'calorie') {
                val = 'calorie.value';
                findfacts[val] = {};
            }
            else if (data.nutrientMatrix[i].matrixName === 'totalGi') {
                val = 'gigl.totalGi';
                findfacts[val] = {};
            }
            else if (data.nutrientMatrix[i].matrixName === 'totalGl') {
                val = 'gigl.totalGl';
                findfacts[val] = {};
            }
            if (data.nutrientMatrix[i].lessThan) {
                findfacts[val] = { $lt: data.nutrientMatrix[i].value };
            }
            else if (data.nutrientMatrix[i].greaterThan) {
                findfacts[val] = { $gt: data.nutrientMatrix[i].value };
            }
            else if (data.nutrientMatrix[i].beetween) {
                findfacts[val] = {
                    $gt: data.nutrientMatrix[i].value1,
                    $lt: data.nutrientMatrix[i].value2,
                };
            }
        }
        let energy = [];
        let mineral = [];
        let vitamin = [];
        for (let i = 0; i < data.nutrientFilters.length; i++) {
            let obj = {};
            obj.blendNutrientRefference = new mongoose_1.default.mongo.ObjectId(data.nutrientFilters[i].nutrientId.toString());
            if (data.nutrientFilters[i].lessThan) {
                obj.value = { $lt: data.nutrientFilters[i].value };
            }
            else if (data.nutrientFilters[i].greaterThan) {
                obj.value = { $gt: data.nutrientFilters[i].value };
            }
            else if (data.nutrientFilters[i].beetween) {
                obj.value = {
                    $gt: data.nutrientFilters[i].value1,
                    $lt: data.nutrientFilters[i].value2,
                };
            }
            if (data.nutrientFilters[i].category === 'energy') {
                energy.push(obj);
            }
            else if (data.nutrientFilters[i].category === 'mineral') {
                mineral.push(obj);
            }
            else if (data.nutrientFilters[i].category === 'vitamin') {
                vitamin.push(obj);
            }
        }
        let recipeFacts = [];
        let recipeIds = [];
        if (energy.length > 0) {
            for (let i = 0; i < energy.length; i++) {
                findfacts['energy'] = { $elemMatch: energy[i] };
                recipeFacts = await recipeOriginalFactModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['energy'];
            }
        }
        if (mineral.length > 0) {
            for (let i = 0; i < mineral.length; i++) {
                findfacts['mineral'] = { $elemMatch: mineral[i] };
                recipeFacts = await recipeOriginalFactModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['mineral'];
            }
        }
        if (vitamin.length > 0) {
            for (let i = 0; i < vitamin.length; i++) {
                findfacts['vitamin'] = { $elemMatch: vitamin[i] };
                recipeFacts = await recipeOriginalFactModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['vitamin'];
            }
        }
        if (recipeIds.length === 0) {
            recipeFacts = await recipeOriginalFactModel_1.default.find(findfacts).select('recipeId');
            recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
            // recipeIds = [];
        }
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
                select: 'ingredientName selectedImage',
            },
            select: 'postfixTitle selectedImage',
        })
            .limit(limit)
            .skip(limit * (page - 1));
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        // let recipes = await RecipeModel.find({
        //   _id: { $in: recipeIds },
        // })
        //   .populate({
        //     path: 'ingredients.ingredientId',
        //     model: 'BlendIngredient',
        //   })
        //   .populate({
        //     path: 'defaultVersion',
        //     model: 'RecipeVersion',
        //     populate: {
        //       path: 'ingredients.ingredientId',
        //       model: 'BlendIngredient',
        //       select: 'ingredientName selectedImage',
        //     },
        //     select: 'postfixTitle selectedImage',
        //   })
        //   .populate({
        //     path: 'userId',
        //     model: 'User',
        //     select: '_id displayName image firstName lastName email',
        //   })
        //   .populate('brand')
        //   .populate('recipeBlendCategory')
        //   .limit(limit)
        //   .skip(limit * (page - 1));
        // let returnRecipe: any = [];
        // let collectionRecipes: any[] = [];
        // let memberCollection = await MemberModel.findOne({ _id: data.userId })
        //   .populate({
        //     path: 'collections',
        //     model: 'UserCollection',
        //     select: 'recipes',
        //   })
        //   .select('-_id collections');
        // for (let i = 0; i < memberCollection.collections.length; i++) {
        //   //@ts-ignore
        //   let items: any = memberCollection.collections[i].recipes.map(
        //     //@ts-ignore
        //     (recipe) => {
        //       return {
        //         recipeId: String(recipe._id),
        //         recipeCollection: String(memberCollection.collections[i]._id),
        //       };
        //     }
        //   );
        //   collectionRecipes.push(...items);
        // }
        // for (let i = 0; i < recipes.length; i++) {
        //   let userNotes = await UserNoteModel.find({
        //     recipeId: recipes[i]._id,
        //     userId: data.userId,
        //   });
        //   let addedToCompare = false;
        //   let compare = await CompareModel.findOne({
        //     userId: data.userId,
        //     recipeId: recipes[i]._id,
        //   });
        //   if (compare) {
        //     addedToCompare = true;
        //   }
        //   let collectionData: any = collectionRecipes.filter(
        //     (recipeData) => recipeData.recipeId === String(recipes[i]._id)
        //   );
        //   if (collectionData.length === 0) {
        //     collectionData = null;
        //   } else {
        //     //@ts-ignore
        //     collectionData = collectionData.map((data) => data.recipeCollection);
        //   }
        //   returnRecipe.push({
        //     //@ts-ignore
        //     ...recipes[i]._doc,
        //     notes: userNotes.length,
        //     addedToCompare: addedToCompare,
        //     userCollections: collectionData,
        //   });
        // }
        //making ids to String
        // let recipeIdsString = recipeIds.map((ri: any) => String(ri));
        //removing duplicates
        // let finalData = recipeIdsString.filter(
        //   (data: any, index: number) => recipeIdsString.indexOf(data) === index
        // );
        let userProfileRecipesTotalCount = await UserRecipeProfile_1.default.countDocuments({
            userId: userId,
            recipeId: { $in: recipeIds },
        });
        return {
            recipes: returnRecipe,
            totalRecipes: userProfileRecipesTotalCount,
        };
    }
    async makeSomeGlobalRecipes() {
        let recipes = await recipeModel_1.default.find({
            addedByAdmin: true,
        });
        for (let i = 0; i < recipes.length; i++) {
            await recipeModel_1.default.updateOne({ _id: recipes[i]._id }, {
                $set: {
                    global: true,
                    userId: null,
                    addedByAdmin: true,
                    discovery: true,
                    isPublished: true,
                },
            });
        }
        return true;
    }
    async juio() {
        await recipeModel_1.default.updateMany({
            brand: null,
            userId: null,
        }, {
            brand: '61cd5083debd9237c577df17',
        });
        // let recipes = await RecipeModel.find({}).select(
        //   'originalVersion name description'
        // );
        // for (let i = 0; i < recipes.length; i++) {
        //   if (!recipes[i].originalVersion) {
        //     continue;
        //   } else {
        //     await RecipeVersionModel.findOneAndUpdate(
        //       {
        //         _id: recipes[i].originalVersion,
        //       },
        //       {
        //         postfixTitle: recipes[i].name,
        //         description: recipes[i].description,
        //       }
        //     );
        //   }
        // }
        return true;
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [Recipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getCompareList", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]) // not sure yet
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllRecipesByBlendCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipesByBlendCategory", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllrecomendedRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]) // done
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllpopularRecipes", null);
__decorate([
    (0, type_graphql_1.Query)(() => RecipesWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "searchRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllLatestRecipes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Recipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getARecipe", null);
__decorate([
    (0, type_graphql_1.Query)((type) => SimpleRecipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getARecipeForAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditRecipe_1.default,
        String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "editARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "deleteARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String) //:NOT USABLE
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addRecipeFromAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => Recipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "removeAllBulkRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data', (type) => [CreateScrappedRecipe_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addBulkScrappedRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Boolean),
    __param(0, (0, type_graphql_1.Arg)('url')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "CheckScrappedRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getA", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [Recipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllRecipesBasedOnIngredient", null);
__decorate([
    (0, type_graphql_1.Query)((type) => [ProfileRecipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "getAllMyCreatedRecipes", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => [Hello_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "addMacroInfo", null);
__decorate([
    (0, type_graphql_1.Query)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "populateAllRecipeFacts", null);
__decorate([
    (0, type_graphql_1.Query)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "populateAllOriginalRecipeFacts", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "removeAllVersionFacts", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default) // not sure yet
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRecipe_1.default,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "filterRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((returns) => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "makeSomeGlobalRecipes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Boolean),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeResolver.prototype, "juio", null);
RecipeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeResolver);
exports.default = RecipeResolver;
//blendCategory
//ingredredients
// give ingredients based on ingredientType
// git nutrients by category
