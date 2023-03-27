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
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const AddVersion_1 = __importDefault(require("./input-type/AddVersion"));
const RecipeVersion_1 = __importDefault(require("../schemas/RecipeVersion"));
const EditVersion_1 = __importDefault(require("./input-type/EditVersion"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const updateVersionFacts_1 = __importDefault(require("./util/updateVersionFacts"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const mongoose_1 = __importDefault(require("mongoose"));
const EditedVersion_1 = __importDefault(require("../schemas/EditedVersion"));
const ProfileRecipeDesc_1 = __importDefault(require("../schemas/ProfileRecipeDesc"));
let RecipeVersionResolver = class RecipeVersionResolver {
    async editAVersionOfRecipe(data) {
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipeId }).select('userId adminId originalVersion');
        let recipeVersion = await RecipeVersionModel_1.default.findOne({
            _id: data.editId,
        }).select('createdBy');
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            recipeId: recipe._id,
            userId: data.userId,
        }).select('originalVersion defaultVersion isMatch');
        if (!userRecipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let willBeModifiedData = data.editableObject;
        if (!willBeModifiedData.selectedImage) {
            willBeModifiedData.selectedImage = recipeVersion.selectedImage;
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
        if (String(data.userId) === String(recipeVersion.createdBy)) {
            let newVersion = await RecipeVersionModel_1.default.findOneAndUpdate({ _id: data.editId }, willBeModifiedData, { new: true });
            //@ts-ignore
            await (0, updateVersionFacts_1.default)(newVersion._id);
            return {
                status: 'recipeVersion updated successfully',
                isNew: false,
            };
        }
        else {
            let newVersion = willBeModifiedData;
            newVersion.recipeId = recipe._id;
            newVersion.createdBy = data.userId;
            if (String(recipe.originalVersion) === String(data.editId)) {
                return new AppError_1.default('You can not edit this version', 400);
            }
            if (String(userRecipe.defaultVersion) === String(data.editId) &&
                userRecipe.isMatch) {
                return new AppError_1.default('You can not edit this version', 400);
            }
            let createdVersion = await RecipeVersionModel_1.default.create(newVersion);
            if (String(userRecipe.defaultVersion) === String(data.editId) &&
                !userRecipe.isMatch) {
                await UserRecipeProfile_1.default.findOneAndUpdate({ _id: userRecipe._id }, { defaultVersion: createdVersion._id });
            } //@ts-ignore
            else if (String(userRecipe.originalVersion) === String(data.editId)) {
                return new AppError_1.default('You can not edit this version', 400);
            }
            else {
                if (data.turnedOn) {
                    await UserRecipeProfile_1.default.findOneAndUpdate({ _id: userRecipe._id }, {
                        $pull: {
                            turnedOnVersions: data.editId,
                        },
                    });
                    await UserRecipeProfile_1.default.findOneAndUpdate({
                        _id: userRecipe._id,
                    }, {
                        $push: {
                            turnedOnVersions: createdVersion._id,
                        },
                    });
                }
                else {
                    await UserRecipeProfile_1.default.findOneAndUpdate({ _id: userRecipe._id }, {
                        $pull: {
                            turnedOnVersions: data.editId,
                        },
                    });
                    await UserRecipeProfile_1.default.findOneAndUpdate({
                        _id: userRecipe._id,
                    }, {
                        $push: {
                            turnedOnVersions: createdVersion._id,
                        },
                    });
                }
            }
            //@ts-ignore
            await (0, updateVersionFacts_1.default)(createdVersion._id);
            return {
                status: newVersion._id,
                isNew: true,
            };
        }
        // if (String(data.userId) === String(recipe.userId)) {
        //   if (String(recipe.originalversion) === String(data.editId)) {
        //     await RecipeModel.findOneAndUpdate(
        //       { _id: recipe._id },
        //       {
        //         name: data.editableObject.postfixTitle,
        //       }
        //     );
        //     delete willBeModifiedData.postfixTitle;
        //   }
        //   return {
        //     status: 'recipeVersion updated successfully',
        //     isNew: false,
        //   };
        // }
    }
    async addVersion(data) {
        let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
            userId: data.userId,
            recipeId: data.recipeId,
        })
            .populate({
            path: 'recipeId',
            model: 'RecipeModel',
        })
            .populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
        });
        if (!userProfileRecipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        //@ts-ignore
        let versionModifiedIngredients = userProfileRecipe.defaultVersion.ingredients;
        if (data.ingredients) {
            let ingredients = data.ingredients;
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
            versionModifiedIngredients = modifiedIngredients;
            //@ts-ignore
        }
        let selectedImage = null;
        if (!data.selectedImage) {
            selectedImage = userProfileRecipe.defaultVersion.selectedImage
                ? userProfileRecipe.defaultVersion.selectedImage
                : userProfileRecipe.recipeId.image[0].image;
        }
        let newVersion = await RecipeVersionModel_1.default.create({
            recipeId: data.recipeId,
            //@ts-ignore
            postfixTitle: data.postfixTitle,
            description: data.description ? data.description : '',
            selectedImage: data.selectedImage ? data.selectedImage : selectedImage,
            //@ts-ignore
            recipeInstructions: userProfileRecipe.defaultVersion.recipeInstructions,
            ingredients: versionModifiedIngredients,
            //@ts-ignore
            servingSize: userProfileRecipe.defaultVersion.servingSize,
            //@ts-ignore
            createdAt: new Date(),
            createdBy: data.userId,
        });
        //recipe
        //@ts-ignore
        await (0, updateVersionFacts_1.default)(newVersion._id);
        let up = await UserRecipeProfile_1.default.findOneAndUpdate({
            userId: data.userId,
            recipeId: data.recipeId,
        }, {
            $push: {
                turnedOnVersions: newVersion._id,
            },
        }, {
            new: true,
        });
        // console.log('up', up);
        let recipeVersion = await RecipeVersionModel_1.default.findOne({
            _id: newVersion._id,
        }).populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        });
        return recipeVersion;
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
    async removeARecipeVersion(versionId, recipeId, userId, isTurnedOn) {
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            userId,
            recipeId,
        });
        if (!userRecipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: recipeId });
        if (String(recipe.originalVersion) === versionId) {
            return new AppError_1.default('the system does not allow it right now', 401);
        }
        else if (String(userRecipe.defaultVersion) === versionId) {
            userRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                userId,
                recipeId,
            }, {
                defaultVersion: recipe.originalVersion,
                isMatch: true,
            }, {
                new: true,
            });
            if (String(recipe.userId) === userId) {
                await recipeModel_1.default.findOneAndUpdate({
                    _id: recipeId,
                }, {
                    defaultVersion: recipe.originalVersion,
                    isMatch: true,
                });
            }
        }
        else if (isTurnedOn) {
            userRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                userId,
                recipeId,
            }, {
                $pull: {
                    turnedOnVersions: new mongoose_1.default.Types.ObjectId(versionId.toString()),
                },
            }, {
                new: true,
            });
        }
        else {
            userRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                userId,
                recipeId,
            }, {
                $pull: {
                    turnedOffVersions: new mongoose_1.default.Types.ObjectId(versionId.toString()),
                },
            }, {
                new: true,
            });
        }
        // let turnedOnVersions = await RecipeVersionModel.find({
        //   _id: {
        //     $in: userRecipe.turnedOnVersions,
        //   },
        // }).select(
        //   '_id postfixTitle description createdAt updatedAt isDefault isOriginal'
        // );
        // let turnedOffVersions = await RecipeVersionModel.find({
        //   _id: {
        //     $in: userRecipe.turnedOffVersions,
        //   },
        // });
        // let defaultVersion = await RecipeVersionModel.findOne({
        //   _id: userRecipe.defaultVersion,
        // }).populate({
        //   path: 'ingredients.ingredientId',
        //   model: 'BlendIngredient',
        // });
        return 'Success';
    }
    async changeDefaultVersion(versionId, recipeId, userId, isTurnOff) {
        if (isTurnOff) {
            await this.turnedOnOrOffVersion(userId, recipeId, versionId, true, false);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: recipeId }).select('userId isMatch originalVersion defaultVersion');
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
            await recipeModel_1.default.findOneAndUpdate({ _id: recipe._id }, {
                defaultVersion: version._id,
                isMatch: isMatch,
            });
        }
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            recipeId: new mongoose_1.default.Types.ObjectId(recipeId),
            userId: new mongoose_1.default.Types.ObjectId(userId),
        }).select('defaultVersion isMatch');
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
        // let newUpdatedRecipe: any = {};
        if (isMatch) {
            // console.log(userRecipe.originalVersion);
            // console.log(userRecipe.defaultVersion);
            await UserRecipeProfile_1.default.findOneAndUpdate({
                recipeId: new mongoose_1.default.Types.ObjectId(recipeId),
                userId: new mongoose_1.default.Types.ObjectId(userId),
            }, {
                $push: {
                    turnedOnVersions: userRecipe.defaultVersion,
                },
                defaultVersion: new mongoose_1.default.Types.ObjectId(versionId),
                isMatch: isMatch,
            });
        }
        else {
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
        }
        //  else {
        //   newUpdatedRecipe = await UserRecipeProfileModel.findOneAndUpdate(
        //     {
        //       recipeId: new mongoose.Types.ObjectId(recipeId),
        //       userId: new mongoose.Types.ObjectId(userId),
        //     },
        //     {
        //       $push: {
        //         turnedOnVersions: new mongoose.Types.ObjectId(
        //           userRecipe.defaultVersion
        //         ),
        //       },
        //       isMatch: isMatch,
        //     },
        //     {
        //       new: true,
        //     }
        //   );
        // }
        return 'Success';
    }
    async turnedOnOrOffVersion(userId, recipeId, versionId, turnedOn, isDefault) {
        let newUpdatedRecipe = {};
        if (isDefault) {
            let userRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: recipeId,
            })
                .populate({
                path: 'recipeId',
                model: 'RecipeModel',
                select: 'originalVersion',
            })
                .select('recipeId isMatch');
            if (userRecipe.isMatch) {
                return new AppError_1.default('this version is originalVersion version', 400);
            }
            else {
                if (turnedOn) {
                    newUpdatedRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                        userId: userId,
                        recipeId: recipeId,
                    }, {
                        $push: {
                            turnedOffVersions: versionId,
                        },
                        //@ts-ignore
                        defaultVersion: userRecipe.recipeId.originalVersion,
                    }, {
                        new: true,
                    });
                }
                else {
                    newUpdatedRecipe = await UserRecipeProfile_1.default.findOneAndUpdate({
                        userId: userId,
                        recipeId: recipeId,
                    }, {
                        $push: {
                            turnedOffVersions: versionId,
                        },
                        //@ts-ignore
                        defaultVersion: userRecipe.recipeId.originalVersion,
                    }, {
                        new: true,
                    });
                }
                return 'Success';
            }
        }
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
    async removeAllVersion() {
        let recipes = await recipeModel_1.default.find();
        for (let i = 0; i < recipes.length; i++) {
            await recipeModel_1.default.findOneAndUpdate({
                _id: recipes[i]._id,
            }, {
                isMatch: true,
            });
        }
        return 'done';
    }
    async getAllVersions(recipeId, userId) {
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
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
        })
            .populate({
            path: 'turnedOffVersions',
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
            //@ts-ignore
            ...userProfileRecipe._doc,
            notes: userNotes.length,
            addedToCompare: addedToCompare,
            userCollections: collectionData,
            versionsCount: versionsCount,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => EditedVersion_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditVersion_1.default]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "editAVersionOfRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => RecipeVersion_1.default) //changed
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
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('versionId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __param(3, (0, type_graphql_1.Arg)('isTurnedOn')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "removeARecipeVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //changed
    ,
    __param(0, (0, type_graphql_1.Arg)('versionID')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __param(3, (0, type_graphql_1.Arg)('isTurnedOff', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String, Boolean]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "changeDefaultVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('versionId')),
    __param(3, (0, type_graphql_1.Arg)('turnedOn')),
    __param(4, (0, type_graphql_1.Arg)('isDefault', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        Boolean,
        Boolean]),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "turnedOnOrOffVersion", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeVersionResolver.prototype, "removeAllVersion", null);
__decorate([
    (0, type_graphql_1.Query)(() => ProfileRecipeDesc_1.default),
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
