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
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const Member_1 = __importDefault(require("../schemas/Member"));
const Collection_1 = __importDefault(require("../schemas/Collection"));
const NewUserInput_1 = __importDefault(require("./input-type/NewUserInput"));
const EditUser_1 = __importDefault(require("./input-type/EditUser"));
const CreateNewCollection_1 = __importDefault(require("./input-type/CreateNewCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const DailyGoal_1 = __importDefault(require("../../../models/DailyGoal"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const collectionAndTheme_1 = __importDefault(require("../schemas/collectionAndTheme"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
let MemberResolver = class MemberResolver {
    async getUserCollectionsAndThemes(userId) {
        let user = await memberModel_1.default.findById(userId)
            .populate('collections')
            .select('collections');
        let collections = user.collections;
        for (let i = 0; i < collections.length; i++) {
            if (collections[i].recipes.length - 1 === -1) {
                // if there are no recipes in the collection
                collections[i].image = null;
                continue;
            }
            let recipe;
            recipe = await recipe_1.default.findOne({
                _id: collections[i].recipes[collections[i].recipes.length - 1]._id,
            }).select('image');
            if (recipe.image.length === 0) {
                collections[i].image = null;
                continue;
            }
            //@ts-ignore
            let image = recipe.image.filter((image) => image.default === true)[0];
            collections[i].image = image ? image.image : recipe.image[0].image;
        }
        return {
            collections: collections,
        };
    }
    async getASingleCollection(slug, userId) {
        let collection = await userCollection_1.default.findOne({
            slug: slug,
            userId: userId,
        })
            .populate({
            path: 'recipes',
            model: 'Recipe',
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
        let recipes = collection.recipes;
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
                ...recipes[i],
                notes: userNotes.length,
                addedToCompare: addedToCompare,
                userCollections: collectionData,
            });
        }
        return {
            _id: collection._id,
            name: collection.name,
            slug: collection.slug,
            image: collection.image,
            recipes: returnRecipe,
        };
    }
    async createNewUser(data) {
        let user = await memberModel_1.default.findOne({ email: data.email })
            .populate('configuration')
            .populate({
            path: 'collections',
            populate: {
                path: 'recipes',
                model: 'Recipe',
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
            let user3 = await memberModel_1.default.findOne({ _id: user2._id })
                .populate('configuration')
                .populate({
                path: 'collections',
                populate: {
                    path: 'recipes',
                    model: 'Recipe',
                },
            });
            return user3;
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
                model: 'Recipe',
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
                model: 'Recipe',
            },
        });
        return user;
    }
    async createNewCollection(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.userId} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
            if (user.collections[i].name === data.collection.name) {
                return new AppError_1.default(`Collection ${data.collection.name} already exists`, 402);
            }
        }
        let newCollection = data.collection;
        newCollection.slug = (0, slugify_1.default)(data.collection.name.toString().toLowerCase());
        newCollection.userId = user._id;
        let collection = await userCollection_1.default.create(data.collection);
        await memberModel_1.default.findOneAndUpdate({ email: data.userId }, { $push: { collections: collection._id } });
        return collection;
    }
    async addNewCollectionWithData(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.userId} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
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
        newCollection.userId = user._id;
        let collection = await userCollection_1.default.create(data.collection);
        await memberModel_1.default.findOneAndUpdate({ email: data.userId }, {
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
        let users = await memberModel_1.default.find().select('firstName lastName displayName email');
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
    async changeCompare(recipeId, userId) {
        let recipe = await recipe_1.default.findOne({ _id: recipeId });
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
                });
                break;
            }
        }
        if (!check) {
            updatedUser = await memberModel_1.default.findOneAndUpdate({ _id: userId }, { $push: { compareList: recipeId }, $inc: { compareLength: 1 } }, { new: true });
            await Compare_1.default.create({
                recipeId: recipeId,
                userId: userId,
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
};
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
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
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
        String]),
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
