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
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const AddVersion_1 = __importDefault(require("./input-type/AddVersion"));
const SimpleVersion_1 = __importDefault(require("../schemas/SimpleVersion"));
const RecipeVersion_1 = __importDefault(require("../schemas/RecipeVersion"));
const EditVersion_1 = __importDefault(require("./input-type/EditVersion"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const RecipeWithVersion_1 = __importDefault(require("../schemas/RecipeWithVersion"));
const updateVersionFacts_1 = __importDefault(require("./util/updateVersionFacts"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const mongoose_1 = __importDefault(require("mongoose"));
let RecipeVersionResolver = class RecipeVersionResolver {
    async editAVersionOfRecipe(data) {
        let recipeVersion = await RecipeVersionModel_1.default.findOne({ _id: data.editId });
        let recipe = await recipe_1.default.findOne({ _id: recipeVersion.recipeId });
        let willBeModifiedData = data.editableObject;
        if (String(recipe.originalversion) === String(data.editId)) {
            await recipe_1.default.findOneAndUpdate({ _id: recipe._id }, {
                name: data.editableObject.postfixTitle,
            });
            delete willBeModifiedData.postfixTitle;
        }
        if (data.editableObject.ingredients) {
            let ingredients = data.editableObject.ingredients;
            let modifiedIngredients = [];
            for (let i = 0; i < ingredients.length; i++) {
                let ingredient = await blendIngredient_1.default.findOne({
                    _id: ingredients[i].ingredientId,
                }).select('portions');
                let mainPortion = ingredient.portions.filter(
                //@ts-ignore
                (portion) => portion.measurement === ingredients[i].selectedPortionName)[0];
                console.log('mainPortion', mainPortion);
                let selectedPortion = {
                    name: ingredients[i].selectedPortionName,
                    gram: ingredients[i].weightInGram,
                    quantity: ingredients[i].weightInGram / +mainPortion.meausermentWeight,
                };
                let portions = [];
                for (let j = 0; j < ingredient.portions.length; j++) {
                    portions.push({
                        name: ingredient.portions[j].measurement,
                        default: ingredient.portions[j].default,
                        gram: ingredient.portions[j].meausermentWeight,
                    });
                }
                modifiedIngredients.push({
                    ingredientId: ingredients[i].ingredientId,
                    portions: portions,
                    selectedPortion: selectedPortion,
                    weightInGram: ingredients[i].weightInGram,
                });
            }
            //@ts-ignore
            willBeModifiedData.ingredients = modifiedIngredients;
            willBeModifiedData.editedAt = Date.now();
        }
        let newVersion = await RecipeVersionModel_1.default.findOneAndUpdate({ _id: data.editId }, willBeModifiedData, { new: true });
        await (0, updateVersionFacts_1.default)(newVersion._id);
        return 'recipeVersion updated successfully';
    }
    async addVersion(data) {
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId }).populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
        });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let newVersion = await RecipeVersionModel_1.default.create({
            recipeId: recipe._id,
            postfixTitle: data.postfixTitle,
            description: data.description ? data.description : '',
            recipeInstructions: recipe.defaultVersion.recipeInstructions,
            ingredients: recipe.defaultVersion.ingredients,
            servingSize: recipe.defaultVersion.servingSize,
        });
        await (0, updateVersionFacts_1.default)(newVersion._id);
        if (String(recipe.userId) === String(data.userId)) {
            await recipe_1.default.findOneAndUpdate({ _id: recipe._id }, {
                $push: {
                    recipeVersion: newVersion._id,
                },
            });
        }
        await UserRecipeProfile_1.default.findOneAndUpdate({
            userId: data.userId,
            recipeId: recipe._id,
        }, {
            $push: {
                turnedOnVersions: newVersion._id,
            },
        });
        return newVersion._id;
    }
    async getARecipeVersion(versionId) {
        let recipeVersion = await RecipeVersionModel_1.default.findOne({
            _id: versionId,
        }).populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        });
        return recipeVersion;
    }
    async removeARecipeVersion(versionId) {
        let recipeVersion = await RecipeVersionModel_1.default.findOne({ _id: versionId });
        let recipeId = recipeVersion.recipeId;
        if (recipeVersion.isDefault === true) {
            let recipe = await recipe_1.default.findOne({ _id: recipeId }).select('originalVersion');
            let originalVersion = await RecipeVersionModel_1.default.findOne({
                _id: recipe.originalVersion,
            });
            await recipe_1.default.findOneAndUpdate({ _id: recipeId }, {
                defaultVersion: originalVersion._id,
            }, { new: true });
            await RecipeVersionModel_1.default.findOneAndUpdate({ _id: originalVersion._id }, {
                isDefault: true,
            });
        }
        let modifiedRecipe = await recipe_1.default.findOneAndUpdate({ _id: recipeId }, { $pull: { recipeVersion: versionId }, isMatch: true }, { new: true })
            .populate({
            path: 'recipeVersion',
            model: 'RecipeVersion',
            select: '_id postfixTitle description createdAt editedAt isDefault isOriginal',
            options: { sort: { isDefault: -1 } },
        })
            .select('recipeVersion');
        await RecipeVersionModel_1.default.findOneAndDelete({ _id: versionId });
        return modifiedRecipe.recipeVersion;
    }
    async changeDefaultVersion(versionId, recipeId, userId) {
        let recipe = await recipe_1.default.findOne({ _id: recipeId }).select('userId isMatch originalVersion defaultVersion');
        let isMatch = true;
        if (String(recipe.originalVersion) !== String(versionId)) {
            isMatch = false;
        }
        if (String(recipe.userId) === userId) {
            let version = await RecipeVersionModel_1.default.findOne({
                _id: versionId,
                recipeId: recipeId,
            });
            if (!version || !recipe) {
                return new AppError_1.default('recipe or version not found', 404);
            }
            await recipe_1.default.findOneAndUpdate({ _id: recipe._id }, {
                defaultVersion: version._id,
                isMatch: isMatch,
            });
        }
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            recipeId: new mongoose_1.default.Types.ObjectId(recipeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).select('defaultVersion');
        await UserRecipeProfile_1.default.findOneAndUpdate({
            recipeId: new mongoose_1.default.Types.ObjectId(recipeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }, {
            $pull: {
                turnedOnVersions: new mongoose_1.default.Types.ObjectId(versionId),
            },
            defaultVersion: new mongoose_1.default.Types.ObjectId(versionId),
            isMatch: isMatch,
        });
        if (String(userRecipe.originalVersion) !== String(userRecipe.defaultVersion)) {
            await UserRecipeProfile_1.default.findOneAndUpdate({
                recipeId: new mongoose_1.default.Types.ObjectId(recipeId),
                userId: new mongoose_1.default.Types.ObjectId(userId),
            }, {
                $push: {
                    turnedOnVersions: new mongoose_1.default.Types.ObjectId(userRecipe.defaultVersion),
                },
            });
        }
        let recipeVersion = await RecipeVersionModel_1.default.findOne({
            _id: versionId,
        }).populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        });
        return recipeVersion;
    }
    async removeAllVersion() {
        let recipes = await recipe_1.default.find();
        for (let i = 0; i < recipes.length; i++) {
            await recipe_1.default.findOneAndUpdate({
                _id: recipes[i]._id,
            }, {
                isMatch: true,
            });
        }
        return 'done';
    }
    async getAllVersions(recipeId, userId) {
        let recipe = await recipe_1.default.findOne({ _id: recipeId })
            .populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .populate({
            path: 'userId',
            model: 'User',
            select: '_id displayName image firstName lastName email',
        })
            .populate({
            path: 'recipeVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
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
            ...recipe._doc,
            notes: userNotes.length,
            addedToCompare: addedToCompare,
            userCollections: collectionData,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditVersion_1.default]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "editAVersionOfRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //changed
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddVersion_1.default]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "addVersion", null);
__decorate([
    (0, type_graphql_1.Query)(() => RecipeVersion_1.default),
    __param(0, (0, type_graphql_1.Arg)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "getARecipeVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [SimpleVersion_1.default]),
    __param(0, (0, type_graphql_1.Arg)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "removeARecipeVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => RecipeVersion_1.default) //changed
    ,
    __param(0, (0, type_graphql_1.Arg)('versionID')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "changeDefaultVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "removeAllVersion", null);
__decorate([
    (0, type_graphql_1.Query)(() => RecipeWithVersion_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "getAllVersions", null);
RecipeVersionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeVersionResolver);
exports.default = RecipeVersionResolver;
