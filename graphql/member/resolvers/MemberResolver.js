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
const slugify_1 = __importDefault(require("slugify"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const Member_1 = __importDefault(require("../schemas/Member"));
const Collection_1 = __importDefault(require("../schemas/Collection"));
const NewUserInput_1 = __importDefault(require("./input-type/NewUserInput"));
const EditUser_1 = __importDefault(require("./input-type/EditUser"));
const CreateNewCollection_1 = __importDefault(require("./input-type/CreateNewCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const collectionShareGlobal_1 = __importDefault(require("../../../models/collectionShareGlobal"));
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const DailyGoal_1 = __importDefault(require("../../../models/DailyGoal"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const collectionAndTheme_1 = __importDefault(require("../schemas/collectionAndTheme"));
const checkAllShareToken_1 = __importDefault(require("../../share/util/checkAllShareToken"));
const share_1 = __importDefault(require("../../../models/share"));
const getAllGlobalRecipes_1 = __importDefault(require("../../recipe/resolvers/util/getAllGlobalRecipes"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("../../recipe/resolvers/util/getNotesCompareAndUserCollection"));
const ShowAllCollection_1 = __importDefault(require("../schemas/ShowAllCollection"));
const SimpleCollection_1 = __importDefault(require("../schemas/SimpleCollection"));
const changeCompare_1 = __importDefault(require("./util/changeCompare"));
const makeShareRecipe_1 = __importDefault(require("../../share/util/makeShareRecipe"));
// type SimpleCollection = {
//   _id: String;
//   name: String;
//   slug: String;
//   recipes: [String];
//   image: String;
//   isShared: Boolean;
//   sharedBy: Member;
// };
// type Member = {
//   _id: String;
//   displayName: String;
//   email: string;
//   firstName: String;
//   lastName: String;
// };
let MemberResolver = class MemberResolver {
    /**
     * Retrieves all simple collections for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Array} An array of collection data, including the ID and name of each collection.
     */
    async getAllSimpleCollections(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
        let collections = [];
        for (let i = 0; i < user.collections.length; i++) {
            let collectionData = {
                _id: user.collections[i]._id,
                name: user.collections[i].name,
            };
            collections.push(collectionData);
        }
        return collections;
    }
    /**
     * Retrieves all collections with recipes for a given user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Array} An array of collections with recipes.
     */
    async getAllCollectionsWithRecipes(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
        // console.log(user);
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(user._id)],
            },
        }).populate({
            path: 'userId',
            select: 'displayName email firstName lastName',
        });
        let collections = [];
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
            select: 'postfixTitle selectedImage',
        })
            .limit(5)
            .lean();
        // console.log('r', userProfileRecentRecipes, 'k');
        if (userProfileRecentRecipes.length > 0) {
            let returnRecentRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecentRecipes);
            collections.push({
                _id: new mongoose_1.default.mongo.ObjectId(),
                name: 'Recent Recipes',
                slug: 'recent-recipes',
                recipes: returnRecentRecipe,
                isShared: false,
                sharedBy: null,
                personalizedName: '',
                canContribute: true,
                canShareWithOther: true,
            });
        }
        for (let i = 0; i < user.collections.length; i++) {
            let returnRecipe = [];
            if (user.collections[i].recipes.length > 0) {
                returnRecipe = await this.getProfileRecipes(user.collections[i].recipes, userId);
            }
            collections.push({
                _id: user.collections[i]._id,
                //@ts-ignore
                name: user.collections[i].name,
                //@ts-ignore
                slug: user.collections[i].slug,
                //@ts-ignore
                recipes: returnRecipe,
                isShared: false,
                sharedBy: null,
                personalizedName: '',
                canContribute: true,
                canShareWithOther: true,
            });
        }
        for (let i = 0; i < otherCollections.length; i++) {
            let shareTo = otherCollections[i].shareTo.filter((share) => String(share.userId) === userId)[0];
            let formatRecipes = otherCollections[i].recipes.map((recipe) => String(recipe));
            //@ts-ignore
            let returnRecipe = await this.getProfileRecipes(formatRecipes, userId);
            collections.push({
                _id: otherCollections[i]._id,
                name: otherCollections[i].name,
                slug: otherCollections[i].slug,
                recipes: returnRecipe,
                isShared: true,
                sharedBy: otherCollections[i].userId,
                personalizedName: shareTo.personalizedName,
                canContribute: shareTo.canContribute,
                canShareWithOther: shareTo.canShareWithOther,
            });
        }
        let userProfileMyRecipes = await UserRecipeProfile_1.default.find({
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
                select: 'ingredientName selectedImage',
            },
            select: 'postfixTitle selectedImage',
        })
            .lean()
            .limit(5);
        let returnMyRecipe = [];
        if (userProfileMyRecipes.length > 0) {
            returnMyRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileMyRecipes);
        }
        collections.push({
            _id: new mongoose_1.default.mongo.ObjectId(),
            name: 'My Recipes',
            slug: 'my-recipes',
            recipes: returnMyRecipe,
            isShared: false,
            sharedBy: null,
            personalizedName: '',
            canContribute: true,
            canShareWithOther: true,
        });
        // console.log('pie,', collections);
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].recipes.length - 1 === -1) {
                // if there are no recipes in the collection
                collections[i].image = null;
                continue;
            }
            // let userProfileRecipe: any = await UserRecipeProfileModel.findOne({
            //   userId: userId,
            //   recipeId: collections[i].recipes[collections[i].recipes.length - 1]._id,
            // })
            //   .populate({
            //     path: 'defaultVersion',
            //     model: 'RecipeVersion',
            //     select: 'selectedImage',
            //   })
            //   .select('defaultVersion')
            //   .lean();
            // console.log(collections[i].name);
            // console.log(
            //   '--------------',
            //   collections[i].recipes[collections[i].recipes.length - 1].defaultVersion
            // );
            // console.log('this');
            if (collections[i].recipes[collections[i].recipes.length - 1].defaultVersion
                .selectedImage === '' ||
                collections[i].recipes[collections[i].recipes.length - 1].defaultVersion
                    .selectedImage === undefined) {
                collections[i].image = null;
                continue;
            }
            //@ts-ignore
            collections[i].image =
                collections[i].recipes[collections[i].recipes.length - 1].defaultVersion.selectedImage;
        }
        return collections;
    }
    /**
     * Retrieves the recipes from the user's profile based on the given recipe IDs and user ID.
     *
     * @param {Array} recipeIds - An array of recipe IDs
     * @param {String} userId - The ID of the user
     * @return {Promise} A promise that resolves to the retrieved recipes
     */
    async getProfileRecipes(recipeIds, userId) {
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
            select: 'postfixTitle selectedImage calorie gigl errorIngredients',
        })
            .lean()
            .limit(5);
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return returnRecipe;
    }
    /**
     * Retrieves the user's collections and themes.
     *
     * @param {String} userId - The ID of the user.
     * @return {Object} - An object containing the user's collections.
     */
    async getUserCollectionsAndThemes(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(user._id)],
            },
            'shareTo.hasAccepted': true,
        }).populate({
            path: 'userId',
            select: 'displayName email firstName lastName',
        });
        let collections = [];
        for (let i = 0; i < user.collections.length; i++) {
            collections.push({
                _id: user.collections[i]._id,
                //@ts-ignore
                name: user.collections[i].name,
                //@ts-ignore
                slug: user.collections[i].slug,
                //@ts-ignore
                recipes: user.collections[i].recipes,
                isShared: false,
                sharedBy: null,
                personalizedName: '',
                canContribute: true,
                canShareWithOther: true,
            });
        }
        for (let i = 0; i < otherCollections.length; i++) {
            let shareTo = otherCollections[i].shareTo.filter((share) => String(share.userId) === userId)[0];
            collections.push({
                _id: otherCollections[i]._id,
                name: otherCollections[i].name,
                slug: otherCollections[i].slug,
                recipes: otherCollections[i].recipes,
                isShared: true,
                sharedBy: otherCollections[i].userId,
                personalizedName: shareTo.personalizedName,
                canContribute: shareTo.canContribute,
                canShareWithOther: shareTo.canShareWithOther,
            });
        }
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].recipes.length - 1 === -1) {
                // if there are no recipes in the collection
                collections[i].image = null;
                continue;
            }
            let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: collections[i].recipes[collections[i].recipes.length - 1]._id,
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                select: 'selectedImage',
            })
                .select('defaultVersion')
                .lean();
            // console.log(
            //   'nimta',
            //   userProfileRecipe,
            //   collections[i].recipes[collections[i].recipes.length - 1]._id,
            //   'ssss',
            //   collections[i]._id
            // );
            if (userProfileRecipe.defaultVersion.selectedImage === '') {
                collections[i].image = null;
                continue;
            }
            //@ts-ignore
            let image = userProfileRecipe.defaultVersion.selectedImage;
            collections[i].image = image;
        }
        return {
            collections: collections,
        };
    }
    /**
     * Retrieves and returns a shared collection based on the provided token.
     *
     * @param {String} userId - The ID of the user making the request.
     * @param {String} token - The token associated with the shared collection.
     * @param {number} [page] - The page number of the shared collection (default: 1).
     * @param {number} [limit] - The maximum number of recipes to return per page (default: 10).
     * @return {Object} - An object containing the details of the shared collection and its recipes.
     */
    async viewSharedCollection(userId, token, page, limit) {
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
    /**
     * Retrieves a single collection based on the provided parameters.
     *
     * @param {String} slug - The slug of the collection.
     * @param {String} userId - The ID of the user.
     * @param {String} collectionId - The ID of the collection (nullable).
     * @param {String} token - The token associated with the collection (nullable).
     * @param {String} singleRecipeCollectionId - The ID of the single recipe collection (nullable).
     * @param {number} page - The page number (nullable).
     * @param {number} limit - The maximum number of items to retrieve (nullable).
     * @return {Object} The retrieved collection.
     */
    async getASingleCollection(slug, userId, collectionId, token, singleRecipeCollectionId, page, limit) {
        let searchId;
        let query = {};
        if (singleRecipeCollectionId) {
            return await this.getSingleRecipeCollection(userId.toString());
        }
        if (token) {
            let globalShare = await collectionShareGlobal_1.default.findOne({
                _id: token,
            });
            if (!globalShare) {
                return new AppError_1.default('Invalid token', 400);
            }
            let acceptedGlobalShare = globalShare.globalAccepted.filter((user) => String(user) === userId)[0];
            if (!acceptedGlobalShare) {
                return await this.viewSharedCollection(userId, token, page, limit);
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
                    return await this.viewSharedCollection(userId, collectionId, page, limit);
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
    /**
     * Creates a new user.
     *
     * @param {NewUserInput} data - the data for the new user
     * @return {Promise<any>} the newly created user
     */
    async createNewUser(data) {
        let user = await memberModel_1.default.findOne({ email: data.email }).select('_id');
        if (!user) {
            let configuration = await memberConfiguiration_1.default.create({
                isCreated: false,
            });
            let collection = await userCollection_1.default.create({
                name: 'My Favorite',
                slug: 'my-favorite',
            });
            let pushedData = data;
            pushedData.configuration = configuration._id;
            pushedData.collections = [collection._id];
            pushedData.defaultCollection = collection._id;
            pushedData.macroInfo = [
                { blendNutrientId: '620b4608b82695d67f28e19c', percentage: 60 },
                { blendNutrientId: '620b4607b82695d67f28e199', percentage: 20 },
                { blendNutrientId: '620b4607b82695d67f28e196', percentage: 20 },
            ];
            let user2 = await memberModel_1.default.create(pushedData);
            let DailyGoal = await DailyGoal_1.default.create({ memberId: user2._id });
            await memberModel_1.default.findOneAndUpdate({ _id: user2._id }, { dailyGoal: DailyGoal._id });
            await userCollection_1.default.findOneAndUpdate({ _id: collection._id }, { userId: user2._id });
            let checkIfNew = await UserRecipeProfile_1.default.find({
                userId: user2._id,
            }).select('_id');
            if (checkIfNew.length === 0) {
                //@ts-ignore
                await (0, getAllGlobalRecipes_1.default)(user2._id);
            }
            let user3 = await memberModel_1.default.findOne({ _id: user2._id })
                .populate('configuration')
                .populate({
                path: 'collections',
                populate: {
                    path: 'recipes',
                    model: 'RecipeModel',
                },
            });
            return user3;
        }
        // await checkTemporaryCompareList(String(user._id));
        let returnUser = await memberModel_1.default.findOne({ email: data.email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: returnUser._id,
        }).select('_id');
        if (checkIfNew.length === 0) {
            returnUser.isCreated = false;
            //@ts-ignore
            await (0, getAllGlobalRecipes_1.default)(returnUser._id);
        }
        return returnUser;
    }
    /**
     * Retrieves a single user by their email address.
     *
     * @param {String} email - The email address of the user.
     * @return {Promise} A promise that resolves to the user object.
     */
    async getASingleUserByEmail(email) {
        let user = await memberModel_1.default.findOne({ email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
                // populate: {
                //   path: 'ingredients.ingredientId',
                //   model: 'BlendIngredient',
                // },
            },
        });
        return user;
    }
    /**
     * Retrieves a single user by their ID.
     *
     * @param {String} id - The ID of the user to retrieve.
     * @return {Promise<User>} The retrieved user object.
     */
    async getASingleUserById(id) {
        let user = await memberModel_1.default.findOne({ _id: id })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
        return user;
    }
    /**
     * Creates a new collection.
     *
     * @param {CreateNewCollection} data - the data for creating the collection
     * @return {Promise<any>} returns the newly created collection
     */
    async createNewCollection(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.userId} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
            //@ts-ignore
            if (user.collections[i].name === data.collection.name) {
                return new AppError_1.default(`Collection ${data.collection.name} already exists`, 402);
            }
        }
        let newCollection = data.collection;
        if (!data.collection.slug) {
            newCollection.slug = (0, slugify_1.default)(data.collection.name.toString().toLowerCase());
        }
        else {
            newCollection.slug = data.collection.slug;
        }
        let prevData = await userCollection_1.default.findOne({
            slug: newCollection.slug,
            userId: data.userId,
        });
        if (prevData) {
            return new AppError_1.default('slug must be unique', 401);
        }
        newCollection.userId = user._id;
        let collection = await userCollection_1.default.create(data.collection);
        await memberModel_1.default.findOneAndUpdate({ _id: data.userId }, { $push: { collections: collection._id } });
        return collection;
    }
    async createCollectionAndShare(data) { }
    /**
     * Adds a new collection with data.
     *
     * @param {CreateNewCollection} data - the data for the new collection
     * @return {Promise<any>} the newly created collection
     */
    async addNewCollectionWithData(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.userId} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
            //@ts-ignore
            if (user.collections[i].name === data.collection.name) {
                return new AppError_1.default(`Collection ${data.collection.name} already exists`, 402);
            }
        }
        let newCollection = data.collection;
        if (!data.collection.slug) {
            newCollection.slug = (0, slugify_1.default)(data.collection.name.toString().toLowerCase());
        }
        else {
            newCollection.slug = data.collection.slug;
        }
        let prevData = await userCollection_1.default.findOne({
            slug: newCollection.slug,
            userId: data.userId,
        });
        if (prevData) {
            return new AppError_1.default('slug must be unique', 401);
        }
        newCollection.userId = user._id;
        let collection = await userCollection_1.default.create(data.collection);
        await memberModel_1.default.findOneAndUpdate({ _id: data.userId }, {
            $push: { collections: collection._id },
            lastModifiedCollection: collection._id,
        });
        return collection;
    }
    /**
     * Retrieves all users from the database.
     *
     * @return {Promise<MemberModel[]>} An array of user objects.
     */
    async getAllusers() {
        let users = await memberModel_1.default.find().populate('configuration');
        return users;
    }
    /**
     * Retrieves all users for a client.
     *
     * @return {Promise<Array>} An array of user objects with properties:
     *                          - firstName: string
     *                          - lastName: string
     *                          - image: string
     *                          - displayName: string
     *                          - email: string
     */
    async getAllusersForClient() {
        let users = await memberModel_1.default.find().select('firstName lastName image displayName email');
        return users;
    }
    /**
     * Removes a user by their ID.
     *
     * @param {String} userId - The ID of the user to be removed.
     * @return {Promise<String>} - A promise that resolves to a string indicating the removal was successful.
     */
    async removeAUserById(userId) {
        await memberModel_1.default.findByIdAndRemove(userId);
        return 'successfully Removed';
    }
    /**
     * Removes a user by email.
     *
     * @param {String} email - The email of the user to remove.
     * @return {String} A string indicating that the user was successfully removed.
     */
    async removeAUserByemail(email) {
        await memberModel_1.default.findOneAndRemove({ email: email });
        return 'successfully Removed';
    }
    /**
     * Retrieves a single user by their ID.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise<User>} The user object.
     */
    async getSingleUSerById(userId) {
        let user = await memberModel_1.default.findById(userId).populate('configuration');
        return user;
    }
    /**
     * Edit a user by their email address.
     *
     * @param {EditUser} data - The data for editing the user.
     * @return {Promise<string>} - A promise that resolves to 'Success' if the user was successfully edited.
     */
    async editUserByEmail(data) {
        await memberModel_1.default.findOneAndUpdate({ email: data.editId }, data.editableObject);
        return 'Success';
    }
    /**
     * Edits a user by their ID.
     *
     * @param {EditUser} data - The data to edit the user with.
     * @return {Promise<string>} Returns a promise that resolves to a string indicating success.
     */
    async editUserById(data) {
        await memberModel_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
    /**
     * Changes the compare mechanism for a given recipe and user.
     *
     * @param {String} recipeId - The ID of the recipe.
     * @param {String} userId - The ID of the user.
     * @return {Promise} A promise that resolves with the result of the change compare mechanism operation.
     */
    async changeCompare(recipeId, userId
    // @Arg('versionId') versionId: String
    ) {
        return await (0, changeCompare_1.default)(recipeId, userId);
    }
    /**
     * Empty the compare list for a user.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise<string>} A string indicating the success of the operation.
     */
    async emptyCompareList(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $set: { compareList: [], compareLength: 0 } });
        await Compare_1.default.deleteMany({ userId: userId });
        return 'Success';
    }
    /**
     * Retrieves all users from the MemberModel and updates their collections.
     *
     * @return {number} The number 1.
     */
    async yyyy() {
        let users = await memberModel_1.default.find().select('collections');
        for (let i = 0; i < users.length; i++) {
            for (let j = 0; j < users[i].collections.length; j++) {
                await userCollection_1.default.findOneAndUpdate({
                    _id: users[i].collections[j],
                }, {
                    $set: { userId: users[i]._id },
                });
            }
        }
        return 1;
    }
    /**
     * Retrieves a single recipe collection for a given user.
     *
     * @param {string} userId - The ID of the user.
     * @return {Object} - The single recipe collection.
     */
    async getSingleRecipeCollection(userId) {
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
    async temporaryRecipeCategoryUpdate(recipeId, blendCategory) {
        await recipeModel_1.default.findOneAndUpdate({
            _id: recipeId,
        }, {
            recipeBlendCategory: blendCategory,
        });
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleCollection_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllSimpleCollections", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ShowAllCollection_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllCollectionsWithRecipes", null);
__decorate([
    (0, type_graphql_1.Query)(() => collectionAndTheme_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getUserCollectionsAndThemes", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "viewSharedCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('collectionId', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __param(4, (0, type_graphql_1.Arg)('singleRecipeCollectionId', { nullable: true })),
    __param(5, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(6, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        String,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASingleCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewUserInput_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createNewUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASingleUserByEmail", null);
__decorate([
    (0, type_graphql_1.Query)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getASingleUserById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewCollection_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createNewCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "createCollectionAndShare", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Collection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewCollection_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "addNewCollectionWithData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Member_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllusers", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Member_1.default])
    /**
     * Retrieves all users for a client.
     *
     * @return {Promise<Array>} An array of user objects with properties:
     *                          - firstName: string
     *                          - lastName: string
     *                          - image: string
     *                          - displayName: string
     *                          - email: string
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getAllusersForClient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "removeAUserById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "removeAUserByemail", null);
__decorate([
    (0, type_graphql_1.Query)(() => Member_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "getSingleUSerById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditUser_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editUserByEmail", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditUser_1.default]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "editUserById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Number),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String
        // @Arg('versionId') versionId: String
    ]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "changeCompare", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "emptyCompareList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Number),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "yyyy", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __param(1, (0, type_graphql_1.Arg)('blendCategory')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], MemberResolver.prototype, "temporaryRecipeCategoryUpdate", null);
MemberResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberResolver);
exports.default = MemberResolver;
