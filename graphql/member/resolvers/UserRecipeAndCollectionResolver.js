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
const recipe_1 = __importDefault(require("../../../models/recipe"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const share_1 = __importDefault(require("../../../models/share"));
const checkAllShareToken_1 = __importDefault(require("../../share/util/checkAllShareToken"));
const Collection_2 = __importDefault(require("../schemas/Collection"));
const Collection_3 = __importDefault(require("../schemas/Collection"));
let UserRecipeAndCollectionResolver = class UserRecipeAndCollectionResolver {
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
        let recipe = await recipe_1.default.findOne({ url: data.recipe.url });
        if (!recipe) {
            recipe = await recipe_1.default.create(data.recipe);
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
        await memberModel_1.default.findOneAndUpdate({ _id: user._id }, { lastModifiedCollection: collection._id, updatedAt: Date.now() });
        return 'successfull';
    }
    async checkForRecipeExistenceInCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let foundRecipeInCollection = false;
        for (let i = 0; i < user.collections.length; i++) {
            for (let j = 0; j < user.collections[i].recipes.length; j++) {
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
    //   let found = false;
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
    async getLastModifieldCollection(userEmail) {
        let user = await memberModel_1.default.findOne({ email: userEmail })
            .populate('defaultCollection')
            .populate('lastModifiedCollection');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        return user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
    }
    async addTolastModifiedCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail });
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let collectionId = user.lastModifiedCollection
            ? user.lastModifiedCollection
            : user.defaultCollection;
        let collection = await userCollection_1.default.findOne({ _id: collectionId });
        let found = false;
        for (let k = 0; k < collection.recipes.length; k++) {
            if (String(collection.recipes[k]) === String(data.recipe)) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('Recipe already in collection', 404);
        }
        await userCollection_1.default.findOneAndUpdate({ _id: collectionId }, {
            $push: { recipes: recipe._id },
            $set: { updatedAt: Date.now(), lastModifiedCollection: collection._id },
        });
        let member = await memberModel_1.default.findOne({ email: data.userEmail }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
            },
        });
        return member.collections;
    }
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
            let Collectionrecipes = await recipe_1.default.find({
                _id: {
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
                    select: 'ingredientName',
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
            recipes = recipes.concat(Collectionrecipes);
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
    async addRecipeToAUserCollection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
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
        for (let k = 0; k < collection.recipes.length; k++) {
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
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async removeRecipeFromAColection(data) {
        let user = await memberModel_1.default.findOne({ email: data.userEmail }).populate('collections');
        if (!user) {
            return new AppError_1.default('User with that email not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipe });
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
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async deleteCollection(data) {
        let user = await memberModel_1.default.findOne({
            _id: data.userId,
        }).populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
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
                        model: 'Recipe',
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
                    model: 'Recipe',
                },
            });
            return user.collections;
        }
        return user.collections;
    }
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
    async changeCollection() {
        await userCollection_1.default.findOneAndUpdate({ _id: '61d7e644bb6b9a32a588fcf5' }, { $set: { recipes: [] } });
        return 'successfull';
    }
    async addOrRemoveRecipeFromCollection(data) {
        console.log('for ref');
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
        console.log(pullFromUserCollections);
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
                if (collection.recipes.indexOf(id) !== -1) {
                    continue;
                }
                else {
                    addTotheseCollection.push(collection._id);
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
                model: 'Recipe',
            },
        });
        return member.collections;
    }
    async getSharedWithMeCollections(userId) {
        let collectionData = [];
        let recipes = [];
        let shares = await share_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
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
            });
        }
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
        })
            .populate({
            path: 'recipes',
            model: 'Recipe',
            limit: 5,
            populate: [
                {
                    path: 'defaultVersion',
                    model: 'RecipeVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
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
            .lean();
        let memberCollections = await memberModel_1.default.findOne({ _id: userId })
            .populate({
            path: 'collections',
            model: 'UserCollection',
            select: 'recipes',
        })
            .select('-_id collections');
        console.log(otherCollections.length);
        for (let i = 0; i < otherCollections.length; i++) {
            let collection = otherCollections[i];
            console.log(collection.name);
            let recipes = collection.recipes;
            let returnRecipe = [];
            let collectionRecipes = [];
            for (let i = 0; i < memberCollections.collections.length; i++) {
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
            console.log(collection._id);
            console.log(collection.name);
            console.log(collection.slug);
            console.log(collection.image);
            console.log(returnRecipe.length);
            collectionData.push({
                _id: collection._id,
                name: collection.name,
                slug: collection.slug,
                image: collection.image,
                recipes: returnRecipe,
            });
            // console.log(collectionData);
        }
        return collectionData;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "createNewUserRecipeWithCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Boolean),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddExistingRecipeInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "checkForRecipeExistenceInCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('userEmail')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getLastModifieldCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddToLastModifiedCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addTolastModifiedCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Recipe_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getAllRecipesFromCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addRecipeToAUserCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [ChangeRecipeCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "removeRecipeFromAColection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_2.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveACollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "deleteCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditCollection_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "editACollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "changeCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [Collection_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddOrRemoveRecipeFromCollectionInput_1.default]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "addOrRemoveRecipeFromCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Collection_3.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserRecipeAndCollectionResolver.prototype, "getSharedWithMeCollections", null);
UserRecipeAndCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserRecipeAndCollectionResolver);
exports.default = UserRecipeAndCollectionResolver;
// Making api for filtering ingredients by category and class
// Nutrition
