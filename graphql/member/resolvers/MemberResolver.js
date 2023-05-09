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
const Compare_1 = __importDefault(require("../../../models/Compare"));
const collectionAndTheme_1 = __importDefault(require("../schemas/collectionAndTheme"));
const checkAllShareToken_1 = __importDefault(require("../../share/util/checkAllShareToken"));
const share_1 = __importDefault(require("../../../models/share"));
const getAllGlobalRecipes_1 = __importDefault(require("../../recipe/resolvers/util/getAllGlobalRecipes"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const getNotesCompareAndUserCollection_1 = __importDefault(require("../../recipe/resolvers/util/getNotesCompareAndUserCollection"));
const ShowAllCollection_1 = __importDefault(require("../schemas/ShowAllCollection"));
const SimpleCollection_1 = __importDefault(require("../schemas/SimpleCollection"));
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
    async getAllCollectionsWithRecipes(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
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
            select: 'postfixTitle',
        })
            .limit(5)
            .sort({
            lastSeen: -1,
        });
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
        for (let i = 0; i < user.collections.length; i++) {
            let returnRecipe = await this.getProfileRecipes(user.collections[i].recipes, userId);
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
            select: 'postfixTitle',
        })
            .limit(5);
        let returnMyRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileMyRecipes);
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
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].recipes.length - 1 === -1) {
                // if there are no recipes in the collection
                collections[i].image = null;
                continue;
            }
            let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: collections[i].recipes[collections[i].recipes.length - 1].recipeId
                    ._id,
            })
                .populate({
                path: 'defaultVersion',
                model: 'RecipeVersion',
                select: 'selectedImage',
            })
                .select('defaultVersion');
            if (userProfileRecipe.defaultVersion.selectedImage === '') {
                collections[i].image = null;
                continue;
            }
            //@ts-ignore
            let image = userProfileRecipe.defaultVersion.selectedImage;
            collections[i].image = image;
        }
        return collections;
    }
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
            select: 'postfixTitle selectedImage calorie gigl',
        })
            .limit(5);
        let returnRecipe = await (0, getNotesCompareAndUserCollection_1.default)(userId, userProfileRecipes);
        return returnRecipe;
    }
    async getUserCollectionsAndThemes(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
        let otherCollections = await userCollection_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(user._id)],
            },
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
                .select('defaultVersion');
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
    async getASingleCollection(slug, userId, collectionId, token, singleRecipeCollectionId, page, limit) {
        let searchId;
        let query = {};
        if (singleRecipeCollectionId) {
            return await this.getSingleRecipeCollection(userId);
        }
        if (token) {
            let globalShare = await collectionShareGlobal_1.default.findOne({
                _id: token,
            });
            if (!globalShare) {
                return new AppError_1.default('Invalid token', 400);
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
        if (!page) {
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
        };
    }
    async createNewUser(data) {
        let user = await memberModel_1.default.findOne({ email: data.email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'RecipeModel',
            },
        });
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
        let checkIfNew = await UserRecipeProfile_1.default.find({
            userId: user._id,
        }).select('_id');
        if (checkIfNew.length === 0) {
            //@ts-ignore
            await (0, getAllGlobalRecipes_1.default)(user._id);
        }
        return user;
    }
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
    async getAllusers() {
        let users = await memberModel_1.default.find().populate('configuration');
        return users;
    }
    async getAllusersForClient() {
        let users = await memberModel_1.default.find().select('firstName lastName image displayName email');
        return users;
    }
    async removeAUserById(userId) {
        await memberModel_1.default.findByIdAndRemove(userId);
        return 'successfully Removed';
    }
    async removeAUserByemail(email) {
        await memberModel_1.default.findOneAndRemove({ email: email });
        return 'successfully Removed';
    }
    async getSingleUSerById(userId) {
        let user = await memberModel_1.default.findById(userId).populate('configuration');
        return user;
    }
    async editUserByEmail(data) {
        await memberModel_1.default.findOneAndUpdate({ email: data.editId }, data.editableObject);
        return 'Success';
    }
    async editUserById(data) {
        await memberModel_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
    async changeCompare(recipeId, userId
    // @Arg('versionId') versionId: String
    ) {
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            userId: userId,
            recipeId: recipeId,
        });
        if (!userRecipe) {
            return new AppError_1.default('recipe not found', 401);
        }
        let user = await memberModel_1.default.findOne({ _id: userId });
        let check = false;
        let updatedUser;
        for (let i = 0; i < user.compareList.length; i++) {
            if (String(user.compareList[i]) === recipeId) {
                updatedUser = await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $pull: { compareList: recipeId }, $inc: { compareLength: -1 } }, { new: true });
                check = true;
                await Compare_1.default.findOneAndRemove({
                    userId: userId,
                    recipeId: recipeId,
                    versionId: userRecipe.defaultVersion,
                });
                break;
            }
        }
        if (!check) {
            updatedUser = await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $push: { compareList: recipeId }, $inc: { compareLength: 1 } }, { new: true });
            await Compare_1.default.create({
                recipeId: recipeId,
                userId: userId,
                versionId: userRecipe.defaultVersion,
            });
        }
        return updatedUser.compareList.length;
    }
    async emptyCompareList(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $set: { compareList: [], compareLength: 0 } });
        await Compare_1.default.deleteMany({ userId: userId });
        return 'Success';
    }
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
    async getSingleRecipeCollection(userId) {
        let shares = await share_1.default.find({
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId.toString())],
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
        };
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
    (0, type_graphql_1.Query)(() => [Member_1.default]),
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
MemberResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], MemberResolver);
exports.default = MemberResolver;
