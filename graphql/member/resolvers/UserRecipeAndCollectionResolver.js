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
const NewUserRecipeInput_1 = __importDefault(require("./input-type/NewUserRecipeInput"));
const AddExistingRecipeInput_1 = __importDefault(require("./input-type/AddExistingRecipeInput"));
const ChangeRecipeCollectionInput_1 = __importDefault(require("./input-type/ChangeRecipeCollectionInput"));
const RemoveACollectionInput_1 = __importDefault(require("./input-type/RemoveACollectionInput"));
const EditCollection_1 = __importDefault(require("./input-type/EditCollection"));
const AddOrRemoveRecipeFromCollectionInput_1 = __importDefault(require("./input-type/AddOrRemoveRecipeFromCollectionInput"));
const AddToLastModifiedCollection_1 = __importDefault(require("./input-type/AddToLastModifiedCollection"));
const Collection_1 = __importDefault(require("../schemas/Collection"));
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const share_1 = __importDefault(require("../../../models/share"));
const checkAllShareToken_1 = __importDefault(require("../../share/util/checkAllShareToken"));
const filterRecipe_1 = __importDefault(require("../../recipe/resolvers/input-type/filterRecipe"));
const RecipesWithPagination_1 = __importDefault(require("../../recipe/schemas/RecipesWithPagination"));
// import RecipeOriginalFactModel from '../../../models/recipeOriginalFactModel';
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const Collection_2 = __importDefault(require("../schemas/Collection"));
const Collection_3 = __importDefault(require("../schemas/Collection"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("../../recipe/resolvers/util/getNotesCompareAndUserCollection"));
const slugify_1 = __importDefault(require("slugify"));
const temporaryCompareCollection_1 = __importDefault(require("../../../models/temporaryCompareCollection"));
let UserRecipeAndCollectionResolver = class UserRecipeAndCollectionResolver {
    /**
     * Retrieves the most recent recipes for a specific user.
     *
     * @param {number} page - The page number of the recipes to retrieve. Default is 1.
     * @param {number} limit - The maximum number of recipes to retrieve. Default is 10.
     * @param {String} userId - The ID of the user whose recipes are being retrieved.
     * @return {Object} - An object containing the user's recent recipes and related information.
     */
    async getMyRecentRecipes(page, limit, userId) {
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        let userProfileRecentRecipes = await UserRecipeProfile_1.default.find({
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
                select: 'ingredientName selectedImage',
            },
            select: 'postfixTitle',
        })
            .sort({
            lastSeen: -1,
        })
            .lean()
            .limit(limit)
            .skip((page - 1) * limit);
        let returnRecentRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecentRecipes);
        let totalUserRecipes = await UserRecipeProfile_1.default.countDocuments({
            userId: userId,
        });
        return {
            _id: new mongoose_1.default.mongo.ObjectId(),
            name: 'My Recent Recipes',
            slug: (0, slugify_1.default)('My Recent Recipes').toLowerCase(),
            image: '',
            totalRecipes: totalUserRecipes,
            recipes: returnRecentRecipe,
            creatorInfo: null,
            accepted: true,
        };
    }
    /**
     * Create a new user recipe with a collection.
     *
     * @param {NewUserRecipeInput} data - The data for the new user recipe.
     * @return {Promise<string>} - A promise that resolves to a string indicating the success of the operation.
     */
    async createNewUserRecipeWithCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ url: data.recipe.url });
        if (!recipe) {
            recipe = await recipeModel_1.default.create(data.recipe);
        }
        let found = false;
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('Recipe already in collection', 304);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
        await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id });
        return 'successfull';
    }
    /**
     * Checks if a recipe exists in a collection.
     *
     * @param {AddExistingRecipeInput} data - The input data containing the recipe details.
     * @return {boolean} - Returns true if the recipe is found in any collection, otherwise false.
     */
    async checkForRecipeExistenceInCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let foundRecipeInCollection = false;
        for (let i = 0; i < user.collections.length; i++) {
            //@ts-ignore
            for (let j = 0; j < user.collections[i].recipes.length; j++) {
                //@ts-ignore
                if (user.collections[i].recipes[j].url === data.recipeUrl) {
                    foundRecipeInCollection = true;
                    return foundRecipeInCollection;
                }
            }
        }
        return foundRecipeInCollection;
    }
    // @Mutation(() => String)
    // async removeRecipesxccc() {
    //   let blendIngredients = await BlendIngredientModel.find();
    //   for (let i = 0; i < blendIngredients.length; i++) {}
    // }
    // @Mutation(() => [CollectionType])
    // async addExistingRecipeToACollectionX(@Arg('data') data: NewUserRecipeInput) {
    //   let user = await MemberModel.findOne({ email: data.userEmail });
    //   if (!user) {
    //     return new AppError('User with that email not found', 404);
    //   }
    //   let collection: any = await UserCollectoionModel.findOne({
    //     _id: data.collectionId,
    //   });
    //   if (!collection) {
    //     return new AppError('Collection not found', 404);
    //   }
    //   let recipe: any = await RecipeModel.findOne({ url: data.recipe.url });
    //   if (!recipe) {
    //     recipe = await RecipeModel.create(data.recipe);
    //   }
    //  let found = false;
    //   for (let k = 0; k < collection.recipes.length; k++) {
    //     if (String(collection.recipes[k]) === String(data.recipe)) {
    //       found = true;
    //       break;
    //     }
    //   }
    //   if (found) {
    //     return new AppError('Recipe already in collection', 304);
    //   }
    //   await UserCollectoionModel.findOneAndUpdate(
    //     { _id: collection._id },
    //     { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } }
    //   );
    //   await MemberModel.findOneAndUpdate(
    //     { _id: user._id },
    //     { lastModifiedCollection: collection._id, updatedAt: Date.now() }
    //   );
    //   return 'successfull';
    // }
    /**
     * Retrieves the last modified collection for a given user.
     *
     * @param {String} userEmail - The email of the user.
     * @return {Collection} The last modified collection for the user, or the default collection if the user has no last modified collection.
     */
    async getLastModifieldCollection(userEmail) {
        let user = await memberModel_1.default.findOne({ email: userEmail })
            .populate('defaultCollection')
            .populate('lastModifiedCollection');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        console.log('hello');
        return user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
    }
    /**
     * Adds the provided data to the last modified collection.
     *
     * @param {AddToLastModifiedCollection} data - The data to be added.
     * @return {Promise<any>} The updated collection.
     */
    async addTolastModifiedCollection(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let collectionId = user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
        let collection = await userCollection_1.default.findOne({
            _id: collectionId,
        });
        console.log(collection);
        let found = false;
        let checkIfInTempCollection = await temporaryCompareCollection_1.default.findOne({
            recipeId: data.recipe,
            userId: data.userId,
        });
        if (checkIfInTempCollection) {
            await temporaryCompareCollection_1.default.findOneAndDelete({
                recipeId: data.recipe,
                userId: data.userId,
            });
        }
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        collection = await userCollection_1.default.findOneAndUpdate({ _id: collectionId }, {
            $push: { recipes: recipe._id },
            $set: { updatedAt: Date.now(), lastModifiedCollection: collection._id },
        }, {
            new: true,
        });
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            userId: data.userId,
            recipeId: data.recipe,
        });
        if (!userRecipe) {
            await UserRecipeProfile_1.default.create({
                recipeId: data.recipe,
                userId: data.userId,
                isMatch: recipe.isMatch,
                allRecipes: false,
                myRecipes: false,
                turnedOffVersions: recipe.turnedOffVersions,
                turnedOnVersions: recipe.turnedOnVersions,
                defaultVersion: recipe.defaultVersion,
            });
        }
        if (collection.shareTo) {
            for (let n = 0; n < collection.shareTo.length; n++) {
                if (collection.shareTo[n].hasAccepted) {
                    let userRecipe = await UserRecipeProfile_1.default.findOne({
                        recipeId: data.recipe,
                        userId: collection.shareTo[n].userId,
                    });
                    if (!userRecipe) {
                        let recipe = await recipeModel_1.default.findOne({
                            _id: data.recipe,
                        }).select('isMatch turnedOffVersions turnedOnVersions defaultVersion');
                        await UserRecipeProfile_1.default.create({
                            recipeId: recipe._id,
                            userId: collection.shareTo[n].userId,
                            isMatch: recipe.isMatch,
                            allRecipes: false,
                            myRecipes: false,
                            turnedOffVersions: recipe.turnedOffVersions,
                            turnedOnVersions: recipe.turnedOnVersions,
                            defaultVersion: recipe.defaultVersion,
                        });
                    }
                }
            }
        }
        // let member = await MemberModel.findOne({ _id: data.userId }).populate({
        //   path: 'collections',
        //   populate: {
        //     path: 'recipes',
        //     model: 'Recipe',
        //   },
        // });
        return collection;
    }
    /**
     * Retrieves all recipes from a collection for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Array} An array of recipes from the collection.
     */
    async getAllRecipesFromCollection(
    // @Arg('userEmail', { nullable: true }) userEmail: String,
    userId) {
        // let user = await MemberModel.findOne({ email: userEmail }).populate({
        //   path: 'collections',
        //   populate: {
        //     path: 'recipes',
        //     model: 'Recipe',
        //     populate: {
        //       path: 'ingredients.ingredientId',
        //       model: 'BlendIngredient',
        //       select: 'ingredientName',
        //     },
        //   },
        // });
        let recipes = [];
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
            let Collectionrecipes = await recipeModel_1.default.find({
                _id: {
                    //@ts-ignore
                    $in: memberCollections[0].collections[i].recipes,
                },
            })
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
                .populate('recipeBlendCategory')
                .lean();
            recipes = recipes.concat(Collectionrecipes);
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
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return returnRecipe;
    }
    /**
     * Adds a recipe to a user's collection.
     *
     * @param {ChangeRecipeCollectionInput} data - the data object containing the recipe and user information
     * @return {Promise<any>} - the updated user's collections
     */
    async addRecipeToAUserCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let found = false;
        let collection;
        for (let k = 0; k < user.collections.length; k++) {
            if (String(user.collections[k]._id) === String(data.collectionId)) {
                collection = user.collections[k];
                found = true;
            }
        }
        if (!found) {
            return new AppError_1.default('Collection not found', 404);
        }
        let found2 = false;
        //@ts-ignore
        for (let k = 0; k < collection.recipes.length; k++) {
            //@ts-ignore
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found2 = true;
                break;
            }
        }
        if (found2) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $push: { recipes: recipe._id }, $set: { updatedAt: Date.now() } });
        let member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id }, { new: true }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        return member.collections;
    }
    /**
     * Remove a recipe from a collection.
     *
     * @param {ChangeRecipeCollectionInput} data - The data for the recipe and the user email.
     * @return {Promise<CollectionModel[]>} The updated collections of the user.
     */
    async removeRecipeFromAColection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let found = false;
        let collection;
        for (let k = 0; k < user.collections.length; k++) {
            if (String(user.collections[k]._id) === String(data.collectionId)) {
                collection = user.collections[k];
                found = true;
            }
        }
        if (!found) {
            return new AppError_1.default('Collection not found', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { $pull: { recipes: recipe._id } });
        let member = await memberModel_1.default.findOne({ _id: user._id }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        return member.collections;
    }
    /**
     * Deletes a collection.
     *
     * @param {RemoveACollectionInput} data - the input data for deleting a collection
     * @return {Promise<any>} - the updated collections after deletion
     */
    async deleteCollection(data) {
        let userDefaultCollection = await userCollection_1.default.findOne({
            userId: data.userId,
            name: 'My Favorite',
        });
        if (String(userDefaultCollection._id) === String(data.collectionId)) {
            return new AppError_1.default('cant remove your default collection', 404);
        }
        let user = await memberModel_1.default.findOne({
            _id: data.userId,
        }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        if (data.isSharedCollection) {
            await userCollection_1.default.findOneAndUpdate({
                _id: data.collectionId,
            }, {
                $pull: {
                    shareTo: {
                        userId: user._id,
                    },
                },
            });
            if (String(user.lastModifiedCollection) === data.collectionId) {
                await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { $set: { lastModifiedCollection: userDefaultCollection._id } });
            }
        }
        else {
            // look for collection in user
            let found = false;
            let collection;
            for (let k = 0; k < user.collections.length; k++) {
                if (String(user.collections[k]._id) === String(data.collectionId)) {
                    found = true;
                    collection = user.collections[k];
                }
            }
            if (!found) {
                return new AppError_1.default('Collection not found in user', 404);
            }
            // look for collection in default collection
            if (String(user.defaultCollection) === String(collection._id)) {
                return new AppError_1.default('You can not delete your default collection', 401);
            }
            let member;
            // look for collection in last modified collection
            if (String(user.lastModifiedCollection) === String(collection._id)) {
                // look for new last modified collection
                await userCollection_1.default.findOneAndRemove({ _id: collection._id });
                member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, {
                    $pull: { collections: collection._id },
                    $set: { updatedAt: Date.now() },
                }, { new: true }).populate('collections');
                let lmc = member.collections[0];
                for (let i = 1; i < member.collections.length; i++) {
                    if (member.collections[i].updatedAt > lmc.updatedAt) {
                        lmc = member.collections[i];
                    }
                }
                member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { $set: { lastModifiedCollection: lmc._id } }, { new: true }).populate({
                    path: 'collections',
                    populate: {
                        path: 'recipes',
                        model: 'RecipeModel',
                    },
                });
                return member.collections;
            }
            await userCollection_1.default.findOneAndRemove({ _id: collection._id });
            member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, {
                $pull: { collections: collection._id },
                $set: { updatedAt: Date.now() },
            }, { new: true }).populate({
                path: 'collections',
                populate: {
                    path: 'recipes',
                    model: 'RecipeModel',
                },
            });
            return user.collections;
        }
        return user.collections;
    }
    /**
     * Edits a collection.
     *
     * @param {EditCollectionInput} data - The data needed to edit the collection.
     * @return {Promise<string | AppError>} - A promise that resolves to a string if the edit is successful, or an instance of AppError if there is an error.
     */
    async editACollection(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User does not exist', 404);
        }
        if (String(data.collectionId) === String(user.defaultCollection)) {
            return new AppError_1.default('You can not edit your default collection', 401);
        }
        if (data.isSharedCollection) {
            await userCollection_1.default.findOneAndUpdate({
                _id: data.collectionId,
                'shareTo.userId': user._id,
            }, {
                $set: {
                    'shareTo.$.personalizedName': data.newName,
                },
            });
            return 'successfull';
        }
        let collection = await userCollection_1.default.findOne({
            _id: data.collectionId,
        });
        if (!collection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, {
            name: data.newName,
        });
        return 'successfull';
    }
    /**
     * Change the collection by finding and updating a document in the UserCollectoionModel collection.
     *
     * @return {string} The string 'successful' indicating that the operation was successful.
     */
    async changeCollection() {
        await userCollection_1.default.findOneAndUpdate({ _id: '61d7e644bb6b9a32a588fcf5' }, { $set: { recipes: [] } });
        return 'successful';
    }
    /**
     * Add or remove a recipe from a collection.
     *
     * @param {AddOrRemoveRecipeFromCollectionInput} data - The input data containing the recipe and collection information.
     * @return {Promise<any>} - A promise that resolves to the updated collections of the user.
     */
    async addOrRemoveRecipeFromCollection(data) {
        if (!data.isCollectionData) {
            data.isCollectionData = false;
        }
        else {
            data.isCollectionData = true;
        }
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(user._id)],
            },
            'shareTo.canContribute': true,
        }).select('_id');
        let pullFromUserCollections = user.collections;
        for (let i = 0; i < otherCollections.length; i++) {
            pullFromUserCollections.push(otherCollections[i]._id);
        }
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let collections = data.addToTheseCollections;
        let lastIndex = collections.length - 1;
        let addTotheseCollection = [];
        for (let i = 0; i < collections.length; i++) {
            let collection = await userCollection_1.default.findOne({
                _id: collections[i],
            });
            console.log(typeof collection._id);
            let index = pullFromUserCollections.indexOf(collection._id);
            pullFromUserCollections.splice(index, 1);
            console.log(pullFromUserCollections);
            for (let j = 0; j < data.recipes.length; j++) {
                let recipeString = data.recipes[j].toString();
                let id = new mongoose_1.default.Types.ObjectId(recipeString).valueOf();
                //@ts-ignore
                if (collection.recipes.indexOf(id) !== -1) {
                    continue;
                }
                else {
                    addTotheseCollection.push(collection._id);
                    if (collection.shareTo) {
                        for (let m = 0; m < data.recipes.length; m++) {
                            for (let n = 0; n < collection.shareTo.length; n++) {
                                if (collection.shareTo[n].hasAccepted) {
                                    let userRecipe = await UserRecipeProfile_1.default.findOne({
                                        recipeId: data.recipes[m],
                                        userId: collection.shareTo[n].userId,
                                    });
                                    if (!userRecipe) {
                                        let recipe = await recipeModel_1.default.findOne({
                                            _id: data.recipes[m],
                                        }).select('isMatch turnedOffVersions turnedOnVersions defaultVersion');
                                        await UserRecipeProfile_1.default.create({
                                            recipeId: recipe._id,
                                            userId: collection.shareTo[n].userId,
                                            isMatch: recipe.isMatch,
                                            allRecipes: false,
                                            myRecipes: false,
                                            turnedOffVersions: recipe.turnedOffVersions,
                                            turnedOnVersions: recipe.turnedOnVersions,
                                            defaultVersion: recipe.defaultVersion,
                                        });
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        if (!data.isCollectionData) {
            await userCollection_1.default.updateMany({ _id: pullFromUserCollections }, { $pullAll: { recipes: data.recipes } }, { $set: { updatedAt: Date.now() } });
        }
        await userCollection_1.default.updateMany({ _id: addTotheseCollection }, { $addToSet: { recipes: data.recipes } }, { $set: { updatedAt: Date.now() } });
        let member = await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collections[lastIndex] }, { new: true }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        return member.collections;
    }
    /**
     * Retrieves the collections that have been shared with the current user.
     *
     * @param {string} userId - The ID of the user.
     * @return {Promise<any[]>} An array of collection data.
     */
    async getSharedWithMeCollections(userId) {
        let collectionData = [];
        let shares = await share_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
            'shareTo.hasAccepted': true,
        }).select('_id');
        if (shares.length > 0) {
            let mappedForSingleRecipeCollection = shares.map((share) => share._id.toString());
            let singleSharedRecipes = await (0, checkAllShareToken_1.default)(
            //@ts-ignore
            mappedForSingleRecipeCollection, userId);
            collectionData.push({
                _id: new mongoose_1.default.Types.ObjectId(),
                name: 'Single Recipes',
                slug: 'single-recipes',
                image: null,
                recipes: singleSharedRecipes,
                //@ts-ignore
                creatorInfo: null,
            });
        }
        //@ts-ignore
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
            'shareTo.hasAccepted': true,
        })
            .populate({
            path: 'recipes',
            model: 'RecipeModel',
            limit: 5,
            populate: [
                {
                    path: 'defaultVersion',
                    model: 'RecipeVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName selectedImage',
                    },
                    select: 'postfixTitle',
                },
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                    select: 'ingredientName',
                },
                {
                    path: 'brand',
                    model: 'RecipeBrand',
                },
                {
                    path: 'recipeBlendCategory',
                    model: 'RecipeCategory',
                },
                {
                    path: 'userId',
                    model: 'User',
                    select: '_id displayName image',
                },
            ],
        })
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName firstName lastName email image',
        })
            .lean();
        let memberCollections = await memberModel_1.default.findOne({ _id: userId })
            .populate({
            path: 'collections',
            model: 'UserCollection',
            select: 'recipes',
        })
            .select('-_id collections');
        for (let i = 0; i < otherCollections.length; i++) {
            let collection = otherCollections[i];
            console.log(collection.name);
            let recipes = collection.recipes;
            let returnRecipe = [];
            let collectionRecipes = [];
            for (let i = 0; i < memberCollections.collections.length; i++) {
                //@ts-ignore
                let items = memberCollections.collections[i].recipes.map(
                //@ts-ignore
                (recipe) => {
                    return {
                        recipeId: String(recipe._id),
                        recipeCollection: String(memberCollections.collections[i]._id),
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
                    ...recipes[i],
                    notes: userNotes.length,
                    addedToCompare: addedToCompare,
                    userCollections: collectionData,
                });
            }
            collectionData.push({
                _id: collection._id,
                name: collection.name,
                slug: collection.slug,
                image: collection.image,
                recipes: returnRecipe,
                creatorInfo: collection.userId,
            });
            // console.log(collectionData);
        }
        return collectionData;
    }
    async filterCollectionRecipe(data, page, limit) {
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
            data.excludeIngredientIds.length == 0 &&
            //@ts-ignore
            data.collectionsIds.length == 0) {
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
        let findInCollection = {
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(data.userId.toString())],
            },
        };
        let find = {};
        let recipeData = [];
        if (data.collectionsIds.length > 0) {
            findInCollection = {
                _id: {
                    $in: data.collectionsIds,
                },
            };
        }
        let allCollectionIdsWithRecipes = await userCollection_1.default.find(findInCollection).select('recipes');
        let collectionRecipeIds = [];
        for (let l = 0; l < allCollectionIdsWithRecipes.length; l++) {
            collectionRecipeIds.push(...allCollectionIdsWithRecipes[l].recipes);
        }
        let collectionRecipeIdSet = new Set(collectionRecipeIds);
        collectionRecipeIds = [...collectionRecipeIdSet];
        if (collectionRecipeIds.length > 0) {
            find = {
                _id: { $in: collectionRecipeIds },
            };
        }
        //@ts-ignore
        if (data.includeIngredientIds.length > 0 && data.blendTypes.length > 0) {
            find = {
                recipeBlendCategory: { $in: data.blendTypes },
                'ingredients.ingredientId': { $in: data.includeIngredientIds },
            };
        }
        else if (data.blendTypes.length > 0) {
            find = {
                recipeBlendCategory: { $in: data.blendTypes },
            };
        }
        else if (data.includeIngredientIds.length > 0) {
            find = {
                'ingredients.ingredientId': { $in: data.includeIngredientIds },
            };
        }
        let findKeys = Object.keys(find);
        if (findKeys.length > 0) {
            recipeData = await recipeModel_1.default.find(find).select('_id');
        }
        else {
            recipeData = [];
        }
        // console.log(recipeData);
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
            else if (data.nutrientMatrix[i].between) {
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
            else if (data.nutrientFilters[i].between) {
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
                recipeFacts = await RecipeVersionModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['energy'];
            }
        }
        if (mineral.length > 0) {
            for (let i = 0; i < mineral.length; i++) {
                findfacts['mineral'] = { $elemMatch: mineral[i] };
                recipeFacts = await RecipeVersionModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['mineral'];
            }
        }
        if (vitamin.length > 0) {
            for (let i = 0; i < vitamin.length; i++) {
                findfacts['vitamin'] = { $elemMatch: vitamin[i] };
                recipeFacts = await RecipeVersionModel_1.default.find(findfacts).select('recipeId');
                recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
                findfacts['recipeId'] = { $in: recipeIds };
                delete findfacts['vitamin'];
            }
        }
        if (recipeIds.length === 0) {
            recipeFacts = await RecipeVersionModel_1.default.find(findfacts).select('recipeId');
            recipeIds = recipeFacts.map((recipe) => recipe.recipeId);
        }
        let recipes = await recipeModel_1.default.find({
            _id: { $in: recipeIds },
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
            .populate('recipeBlendCategory')
            .limit(limit)
            .skip(limit * (page - 1));
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
                //@ts-ignore
                ...recipes[i]._doc,
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        //making ids to String
        let recipeIdsString = recipeIds.map((ri) => String(ri));
        //removing duplicates
        let finalData = recipeIdsString.filter((data, index) => recipeIdsString.indexOf(data) === index);
        return {
            recipes: returnRecipe,
            totalRecipes: finalData.length,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Collection_3.default)
    /**
     * Retrieves the most recent recipes for a specific user.
     *
     * @param {number} page - The page number of the recipes to retrieve. Default is 1.
     * @param {number} limit - The maximum number of recipes to retrieve. Default is 10.
     * @param {String} userId - The ID of the user whose recipes are being retrieved.
     * @return {Object} - An object containing the user's recent recipes and related information.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getMyRecentRecipes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Create a new user recipe with a collection.
     *
     * @param {NewUserRecipeInput} data - The data for the new user recipe.
     * @return {Promise<string>} - A promise that resolves to a string indicating the success of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "createNewUserRecipeWithCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean)
    /**
     * Checks if a recipe exists in a collection.
     *
     * @param {AddExistingRecipeInput} data - The input data containing the recipe details.
     * @return {boolean} - Returns true if the recipe is found in any collection, otherwise false.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddExistingRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "checkForRecipeExistenceInCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Collection_1.default)
    /**
     * Retrieves the last modified collection for a given user.
     *
     * @param {String} userEmail - The email of the user.
     * @return {Collection} The last modified collection for the user, or the default collection if the user has no last modified collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getLastModifieldCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_2.default)
    /**
     * Adds the provided data to the last modified collection.
     *
     * @param {AddToLastModifiedCollection} data - The data to be added.
     * @return {Promise<any>} The updated collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddToLastModifiedCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addTolastModifiedCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Recipe_1.default])
    /**
     * Retrieves all recipes from a collection for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Array} An array of recipes from the collection.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getAllRecipesFromCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default])
    /**
     * Adds a recipe to a user's collection.
     *
     * @param {ChangeRecipeCollectionInput} data - the data object containing the recipe and user information
     * @return {Promise<any>} - the updated user's collections
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addRecipeToAUserCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default])
    /**
     * Remove a recipe from a collection.
     *
     * @param {ChangeRecipeCollectionInput} data - The data for the recipe and the user email.
     * @return {Promise<CollectionModel[]>} The updated collections of the user.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "removeRecipeFromAColection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default])
    /**
     * Deletes a collection.
     *
     * @param {RemoveACollectionInput} data - the input data for deleting a collection
     * @return {Promise<any>} - the updated collections after deletion
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveACollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "deleteCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Edits a collection.
     *
     * @param {EditCollectionInput} data - The data needed to edit the collection.
     * @return {Promise<string | AppError>} - A promise that resolves to a string if the edit is successful, or an instance of AppError if there is an error.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "editACollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Change the collection by finding and updating a document in the UserCollectoionModel collection.
     *
     * @return {string} The string 'successful' indicating that the operation was successful.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "changeCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_1.default])
    /**
     * Add or remove a recipe from a collection.
     *
     * @param {AddOrRemoveRecipeFromCollectionInput} data - The input data containing the recipe and collection information.
     * @return {Promise<any>} - A promise that resolves to the updated collections of the user.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddOrRemoveRecipeFromCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addOrRemoveRecipeFromCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Collection_3.default])
    /**
     * Retrieves the collections that have been shared with the current user.
     *
     * @param {string} userId - The ID of the user.
     * @return {Promise<any[]>} An array of collection data.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getSharedWithMeCollections", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipesWithPagination_1.default) // not sure yet
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [filterRecipe_1.default, Number, Number]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "filterCollectionRecipe", null);
UserRecipeAndCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserRecipeAndCollectionResolver);
exports.default = UserRecipeAndCollectionResolver;
// Making api for filtering ingredients by category and class
// Nutrition
