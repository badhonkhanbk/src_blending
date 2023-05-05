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
const CreatePlanner_1 = __importDefault(require("./input-type/CreatePlanner"));
const Plan_1 = __importDefault(require("../../../models/Plan"));
const Planner_1 = __importDefault(require("../../../models/Planner"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const GroceryList_1 = __importDefault(require("../../../models/GroceryList"));
const Planner_2 = __importDefault(require("../schemas/Planner"));
const PlannerRecipe_1 = __importDefault(require("../../planner/schemas/PlannerRecipe"));
const PlannerWithRecipes_1 = __importDefault(require("../schemas/PlannerWithRecipes"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const MovePlanner_1 = __importDefault(require("./input-type/MovePlanner"));
const FormateDate_1 = __importDefault(require("../../../utils/FormateDate"));
const getRecipeCategoryPercentage_1 = __importDefault(require("./utils/getRecipeCategoryPercentage"));
const getIngredientStats_1 = __importDefault(require("./utils/getIngredientStats"));
const PlannersIngredientAndCategoryPercentage_1 = __importDefault(require("../schemas/PlannersIngredientAndCategoryPercentage"));
const getNotesCompareAndUserCollectionsForPlanner_1 = __importDefault(require("../../recipe/resolvers/util/getNotesCompareAndUserCollectionsForPlanner"));
var MergeOrReplace;
(function (MergeOrReplace) {
    MergeOrReplace["MERGE"] = "MERGE";
    MergeOrReplace["REMOVE"] = "REMOVE";
})(MergeOrReplace || (MergeOrReplace = {}));
(0, type_graphql_1.registerEnumType)(MergeOrReplace, {
    name: 'mergerOrRemove',
    description: 'The basic directions', // this one is optional
});
let PlannerResolver = class PlannerResolver {
    async createPlanner(data) {
        let isoDate = new Date(data.assignDate).toISOString();
        console.log(isoDate);
        let planner = await Planner_1.default.findOne({
            assignDate: isoDate,
            memberId: data.memberId,
        });
        if (planner) {
            if (!planner.recipes.filter(
            //@ts-ignore
            (recipe) => recipe.toString() === data.recipe)[0]) {
                await Planner_1.default.findOneAndUpdate({ _id: planner._id }, { $push: { recipes: data.recipe } });
            }
        }
        else {
            return await Planner_1.default.create({
                memberId: data.memberId,
                assignDate: data.assignDate,
                formatedDate: data.assignDate,
                recipes: [data.recipe],
            });
        }
        return planner;
    }
    // @Mutation(() => Planner)
    // async makeDuplicatePlanner(@Arg('data') plannerId: String) {
    //   let planner = await PlannerModel.findOne({ _id: plannerId });
    //   let newPlanner = await PlannerModel.create({
    //     memberId: planner.memberId,
    //     recipes: planner.recipes,
    //     assignDate: planner.assignDate,
    //   });
    //   return newPlanner;
    // }
    async movePlanner(data) {
        let isoDate = new Date(data.assignDate).toISOString();
        let planner = await Planner_1.default.findOne({ _id: data.plannerId });
        if (!planner) {
            return new AppError_1.default('Planner not found', 404);
        }
        let prevPlanner = await Planner_1.default.findOne({
            memberId: planner.memberId,
            formatedDate: data.assignDate,
        });
        await Planner_1.default.findOneAndUpdate({ _id: data.plannerId }, { $pull: { recipes: data.recipeId } });
        let returnPlanner;
        if (prevPlanner) {
            returnPlanner = await Planner_1.default.findOneAndUpdate({ _id: prevPlanner._id }, { $addToSet: { recipes: [data.recipeId] } });
        }
        else {
            returnPlanner = await Planner_1.default.create({
                memberId: planner.memberId,
                assignDate: isoDate,
                formatedDate: data.assignDate,
                recipes: [data.recipeId],
                createdAt: new Date(),
            });
        }
        return returnPlanner;
    }
    async deletePlanner(plannerId, recipeId) {
        let planner = await Planner_1.default.findOneAndUpdate({ _id: plannerId }, { $pull: { recipes: recipeId } }, { new: true }).select('recipes');
        if (planner.recipes.length === 0) {
            await Planner_1.default.findByIdAndDelete(plannerId);
            return 'Planner Deleted';
        }
        //NOTE:
        return 'Planner recipe removed';
    }
    async getPlannerByDates(startDate, endDate, userId) {
        let startDateISO = new Date(startDate);
        let endDateISO = new Date(endDate);
        let days = await this.getDifferenceInDays(startDateISO, endDateISO);
        let planners = [];
        let recipeCategories = [];
        let ingredients = [];
        let tempDay = startDateISO;
        for (let i = 0; i <= Number(days); i++) {
            let planner = await Planner_1.default.findOne({
                memberId: userId,
                recipes: { $ne: [] },
                assignDate: tempDay,
            })
                .sort({
                assignDate: 1,
            })
                .lean();
            if (planner) {
                let userProfileRecipes = await UserRecipeProfile_1.default.find({
                    userId: userId,
                    recipeId: {
                        $in: planner.recipes,
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
                            select: 'firstName lastName displayName email',
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
                        select: 'ingredientName selectedImage featuredImage',
                    },
                })
                    .lean();
                // console.log(userProfileRecipes[0]);
                let returnRecipe = await (0, getNotesCompareAndUserCollectionsForPlanner_1.default)(userId, userProfileRecipes);
                planner.ProfileRecipes = returnRecipe;
                planners.push(planner);
                if (userProfileRecipes.length > 0) {
                    for (let j = 0; j < userProfileRecipes.length; j++) {
                        recipeCategories.push({
                            //@ts-ignore
                            _id: userProfileRecipes[j].recipeId.recipeBlendCategory._id,
                            //@ts-ignore
                            name: userProfileRecipes[j].recipeId.recipeBlendCategory.name,
                        });
                        for (let k = 0; 
                        //@ts-ignore
                        k < userProfileRecipes[j].defaultVersion.ingredients.length; k++) {
                            ingredients.push({
                                //@ts-ignore
                                _id: userProfileRecipes[j].defaultVersion.ingredients[k]
                                    .ingredientId._id,
                                //@ts-ignore
                                name: userProfileRecipes[j].defaultVersion.ingredients[k]
                                    .ingredientId.ingredientName,
                                featuredImage: 
                                //@ts-ignore
                                userProfileRecipes[j].defaultVersion.ingredients[k]
                                    .ingredientId.featuredImage,
                            });
                        }
                    }
                }
            }
            else {
                planners.push({
                    _id: new mongoose_1.default.mongo.ObjectId(),
                    memberId: userId,
                    ProfileRecipes: [],
                    formatedDate: (0, FormateDate_1.default)(tempDay),
                });
            }
            tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
            // console.log(planners);
        }
        let categoryPercentages = await (0, getRecipeCategoryPercentage_1.default)(recipeCategories);
        let ingredientsStats = await (0, getIngredientStats_1.default)(ingredients);
        // console.log(planners);
        return {
            planners,
            topIngredients: ingredientsStats,
            recipeCategoriesPercentage: categoryPercentages,
        };
    }
    async getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }
    async clearPlannerByDates(startDate, endDate, userId) {
        let startDateISO = new Date(startDate).toISOString();
        let endDateISO = new Date(endDate).toISOString();
        await Planner_1.default.deleteMany({
            memberId: userId,
            assignDate: {
                $gte: startDateISO,
                $lte: endDateISO,
            },
        });
        return 'successfully cleared';
    }
    async getAllPlannersByUserId(userId) {
        return Planner_1.default.find({ memberId: userId })
            .sort({ assignDate: -1 })
            .populate({
            path: 'recipes',
            populate: [
                { path: 'recipeBlendCategory' },
                { path: 'brand' },
                {
                    path: 'defaultVersion',
                    model: 'RecipeVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName featuredImage',
                    },
                    select: 'postfixTitle',
                },
                {
                    path: 'ingredients.ingredientId',
                    model: 'BlendIngredient',
                },
            ],
        })
            .lean();
    }
    async getAllRecipesForPlanner(userId, limit, page, searchTerm, recipeBlendCategory) {
        // console.log(searchTerm);
        let user = await memberModel_1.default.findOne({ _id: userId }).select('collections');
        let recipesId = [];
        for (let i = 0; i < user.collections.length; i++) {
            let collection = await userCollection_1.default.findOne({
                _id: user.collections[i],
            }).select('recipes');
            //@ts-ignore
            let recipes = collection.recipes.map((recipe) => String(recipe));
            recipesId.push(...recipes);
        }
        recipesId = [...new Set(recipesId)];
        let latestRecipes = await recipeModel_1.default.find({
            _id: { $nin: recipesId },
        }).sort({ createdAt: -1 });
        for (let i = 0; i < latestRecipes.length; i++) {
            recipesId.push(String(latestRecipes[i]._id));
        }
        let recipesSize = 0;
        let recipes = [];
        let find = {};
        if (recipeBlendCategory === '' ||
            recipeBlendCategory === null ||
            recipeBlendCategory === undefined) {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                _id: { $in: recipesId },
            };
            recipes = await recipeModel_1.default.find(find).select('_id');
        }
        else {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                recipeBlendCategory: new mongoose_1.default.mongo.ObjectId(recipeBlendCategory),
                _id: { $in: recipesId },
            };
            recipes = await recipeModel_1.default.find(find).select('_id');
        }
        recipesId = recipes.map((recipe) => String(recipe._id));
        // let recipes = await RecipeModel.find(find)
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
        //     },
        //   })
        //   .populate('brand')
        //   .populate('recipeBlendCategory')
        //   .limit(limit)
        //   .sort({ _id: -1 })
        //   .skip(limit * (page - 1))
        //   .lean();
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
            recipeId: {
                $in: recipesId,
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
                    select: 'firstName lastName displayName email',
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
                select: 'ingredientName selectedImage featuredImage',
            },
        })
            .lean()
            .limit(limit)
            .skip(limit * (page - 1));
        // console.log(userProfileRecipes[0]);
        let returnRecipe = await (0, getNotesCompareAndUserCollectionsForPlanner_1.default)(userId, userProfileRecipes);
        return {
            recipes: returnRecipe,
            totalRecipe: await UserRecipeProfile_1.default.countDocuments({
                userId: userId,
                recipeId: {
                    $in: recipesId,
                },
            }),
        };
    }
    async getQuedPlanner(userId, 
    // @Arg('limit') limit: number,
    // @Arg('page') page: number,
    // @Arg('searchTerm') searchTerm: String,
    // @Arg('recipeBlendCategory', { nullable: true }) recipeBlendCategory: string,
    currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        console.log(today);
        let firstday = new Date(today.setDate(today.getDate() - today.getDay() + 0));
        let lastday = new Date(today.setDate(today.getDate() + 6));
        console.log(firstday);
        console.log(lastday);
        let planners = await Planner_1.default.find({
            memberId: userId,
            assignDate: {
                $gte: firstday,
                $lte: lastday,
            },
        })
            .select('recipes')
            .lean();
        let recipeIds = [];
        let recipes = [];
        for (let i = 0; i < planners.length; i++) {
            //@ts-ignore
            let recipes = planners[i].recipes.map((recipe) => String(recipe));
            recipeIds.push(...recipes);
        }
        recipeIds = [...new Set(recipeIds)];
        let find = { _id: { $in: recipeIds } };
        // if (
        //   recipeBlendCategory === '' ||
        //   recipeBlendCategory === null ||
        //   recipeBlendCategory === undefined
        // ) {
        //   find = {
        //     name: { $regex: searchTerm, $options: 'i' },
        //     _id: { $in: recipeIds },
        //   };
        //   recipes = await RecipeModel.find(find).select('_id');
        // } else {
        //   find = {
        //     name: { $regex: searchTerm, $options: 'i' },
        //     recipeBlendCategory: new mongoose.mongo.ObjectId(recipeBlendCategory),
        //     _id: { $in: recipeIds },
        //   };
        //   recipes = await RecipeModel.find(find).select('_id');
        // }
        recipes = await recipeModel_1.default.find(find).select('_id');
        let recipesId = recipes.map((recipe) => String(recipe._id));
        // console.log(recipesId);
        let userProfileRecipes = await UserRecipeProfile_1.default.find({
            userId: userId,
            recipeId: {
                $in: recipesId,
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
                    select: 'firstName lastName displayName email',
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
            .lean();
        // .limit(limit)
        // .skip(limit * (page - 1));
        // console.log(userProfileRecipes[0]);
        let returnRecipe = await (0, getNotesCompareAndUserCollectionsForPlanner_1.default)(userId, userProfileRecipes);
        return {
            recipes: returnRecipe,
            totalRecipe: await UserRecipeProfile_1.default.countDocuments({
                userId: userId,
                recipeId: {
                    $in: recipesId,
                },
            }),
        };
    }
    async addToGroceryFromPlanner(memberId, recipeId) {
        let recipe = await UserRecipeProfile_1.default.findOne({
            recipeId: recipeId,
            userId: memberId,
        }).populate({
            path: 'defaultVersion',
            model: 'RecipeVersion',
            populate: {
                path: 'ingredients.ingredientId',
                model: 'BlendIngredient',
            },
        });
        let member = await memberModel_1.default.findOne({ _id: memberId });
        if (!recipe || !member) {
            return new AppError_1.default('Recipe or member not found', 404);
        }
        let groceryList = await GroceryList_1.default.findOne({
            memberId: memberId,
        });
        let groceryIngredients = [];
        if (groceryList) {
            for (let i = 0; i < recipe.defaultVersion.ingredients.length; i++) {
                if (!groceryList.list.filter(
                //@ts-ignore
                (item) => String(item.ingredientId) ===
                    String(recipe.defaultVersion.ingredients[i].ingredientId))[0]) {
                    groceryIngredients.push({
                        ingredientId: recipe.defaultVersion.ingredients[i].ingredientId,
                        selectedPortion: recipe.defaultVersion.ingredients[i].selectedPortion.name,
                        quantity: recipe.defaultVersion.ingredients[i].selectedPortion.quantity,
                    });
                }
            }
        }
        if (groceryIngredients.length === 0) {
            return 'done';
        }
        if (!groceryList) {
            await GroceryList_1.default.create({
                memberId: memberId,
                list: groceryIngredients,
            });
        }
        else {
            await GroceryList_1.default.findOneAndUpdate({ memberId: memberId }, {
                $push: {
                    list: groceryIngredients,
                },
            });
        }
        return 'successfully added to grocery';
    }
    async mergeOrReplacePlanner(startDate, endDate, memberId, planId, mergeOrReplace) {
        let tempDay = new Date(startDate);
        let plan = await Plan_1.default.findOne({
            _id: planId,
        });
        if (!plan) {
            return new AppError_1.default('Plan not found', 404);
        }
        let planData = plan.planData;
        if (!(planData.length === 7)) {
            return new AppError_1.default('Plan data is not valid', 400);
        }
        if (mergeOrReplace === 'MERGE') {
            await this.mergeToPlanner(planData, tempDay, memberId);
        }
        else {
            await this.replaceToPlanner(planData, tempDay, memberId);
        }
        return 'done';
    }
    async mergeToPlanner(planData, tempDate, memberId) {
        for (let i = 0; i < 7; i++) {
            let planner = await Planner_1.default.findOne({
                memberId: memberId,
                assignDate: tempDate,
            });
            let recipes = planData[i].recipes.map((recipe) => String(recipe));
            if (planner) {
                await Planner_1.default.findOneAndUpdate({
                    _id: planner._id,
                }, {
                    $addToSet: {
                        recipes: recipes,
                    },
                });
            }
            else {
                console.log('hello');
                await Planner_1.default.create({
                    memberId: memberId,
                    assignDate: tempDate,
                    recipes: recipes,
                    formatedDate: (0, FormateDate_1.default)(tempDate),
                });
            }
            tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1));
        }
        return 'done';
    }
    async replaceToPlanner(planData, tempDate, memberId) {
        for (let i = 0; i < 7; i++) {
            let planner = await Planner_1.default.findOne({
                memberId: memberId,
                assignDate: tempDate,
            });
            let recipes = planData[i].recipes.map((recipe) => String(recipe));
            if (planner) {
                await Planner_1.default.findOneAndUpdate({
                    _id: planner._id,
                }, {
                    recipes: recipes,
                });
            }
            else {
                await Planner_1.default.create({
                    memberId: memberId,
                    assignDate: tempDate,
                    recipes: recipes,
                    formatedDate: (0, FormateDate_1.default)(tempDate),
                });
            }
            tempDate = new Date(tempDate.setDate(tempDate.getDate() + 1));
        }
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Planner_2.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlanner_1.default]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "createPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Planner_2.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MovePlanner_1.default]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "movePlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('plannerId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deletePlanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlannersIngredientAndCategoryPercentage_1.default),
    __param(0, (0, type_graphql_1.Arg)('startDate')),
    __param(1, (0, type_graphql_1.Arg)('endDate')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getPlannerByDates", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('startDate')),
    __param(1, (0, type_graphql_1.Arg)('endDate')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "clearPlannerByDates", null);
__decorate([
    (0, type_graphql_1.Query)(() => [PlannerWithRecipes_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getAllPlannersByUserId", null);
__decorate([
    (0, type_graphql_1.Query)((type) => PlannerRecipe_1.default) // for planner
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('limit')),
    __param(2, (0, type_graphql_1.Arg)('page')),
    __param(3, (0, type_graphql_1.Arg)('searchTerm')),
    __param(4, (0, type_graphql_1.Arg)('recipeBlendCategory', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getAllRecipesForPlanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlannerRecipe_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getQuedPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "addToGroceryFromPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('startDate')),
    __param(1, (0, type_graphql_1.Arg)('endDate', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('memberId')),
    __param(3, (0, type_graphql_1.Arg)('planId')),
    __param(4, (0, type_graphql_1.Arg)('mergeOrReplace', (type) => MergeOrReplace)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String,
        String,
        String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "mergeOrReplacePlanner", null);
PlannerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlannerResolver);
exports.default = PlannerResolver;
