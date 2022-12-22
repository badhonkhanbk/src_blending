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
const recipe_1 = __importDefault(require("../../../models/recipe"));
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
                .populate({
                path: 'recipes',
                populate: [
                    { path: 'recipeBlendCategory' },
                    { path: 'brand' },
                    {
                        path: 'defaultVersion',
                        populate: {
                            path: 'ingredients.ingredientId',
                            model: 'BlendIngredient',
                            select: 'ingredientName featuredImage',
                        },
                        select: 'postfixTitle ingredients',
                    },
                ],
            })
                .sort({ assignDate: 1 })
                .lean();
            if (planner) {
                planners.push(planner);
                if (planner.recipes.length > 0) {
                    for (let j = 0; j < planner.recipes.length; j++) {
                        recipeCategories.push({
                            _id: planner.recipes[j].recipeBlendCategory._id,
                            name: planner.recipes[j].recipeBlendCategory.name,
                        });
                        for (let k = 0; k < planner.recipes[j].defaultVersion.ingredients.length; k++) {
                            ingredients.push({
                                _id: planner.recipes[j].defaultVersion.ingredients[k]
                                    .ingredientId._id,
                                name: planner.recipes[j].defaultVersion.ingredients[k]
                                    .ingredientId.ingredientName,
                                featuredImage: planner.recipes[j].defaultVersion.ingredients[k].ingredientId
                                    .featuredImage,
                            });
                        }
                    }
                }
            }
            else {
                planners.push({
                    _id: new mongoose_1.default.mongo.ObjectId(),
                    memberId: userId,
                    recipes: [],
                    formatedDate: (0, FormateDate_1.default)(tempDay),
                });
            }
            tempDay = new Date(tempDay.setDate(tempDay.getDate() + 1));
        }
        let categoryPercentages = await (0, getRecipeCategoryPercentage_1.default)(recipeCategories);
        let ingredientsStats = await (0, getIngredientStats_1.default)(ingredients);
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
        console.log(searchTerm);
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
        let latestRecipes = await recipe_1.default.find({
            _id: { $nin: recipesId },
        }).sort({ createdAt: -1 });
        for (let i = 0; i < latestRecipes.length; i++) {
            recipesId.push(String(latestRecipes[i]._id));
        }
        let recipesSize = 0;
        let find = {};
        if (recipeBlendCategory === '' ||
            recipeBlendCategory === null ||
            recipeBlendCategory === undefined) {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                _id: { $in: recipesId },
            };
            recipesSize = recipesId.length;
        }
        else {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                recipeBlendCategory: new mongoose_1.default.mongo.ObjectId(recipeBlendCategory),
                _id: { $in: recipesId },
            };
            let recipes = await recipe_1.default.find(find).select('_id');
            recipesSize = recipes.length;
        }
        let recipes = await recipe_1.default.find(find)
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
            },
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .limit(limit)
            .sort({ _id: -1 })
            .skip(limit * (page - 1))
            .lean();
        return {
            recipes: recipes,
            totalRecipe: recipesSize,
        };
    }
    async getQuedPlanner(userId, limit, page, searchTerm, recipeBlendCategory, currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        console.log(today);
        let firstday = new Date(today.setDate(today.getDate() - today.getDay() + 1));
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
        for (let i = 0; i < planners.length; i++) {
            //@ts-ignore
            let recipes = planners[i].recipes.map((recipe) => String(recipe));
            recipeIds.push(...recipes);
        }
        recipeIds = [...new Set(recipeIds)];
        let recipesSize = 0;
        let find = {};
        if (recipeBlendCategory === '' ||
            recipeBlendCategory === null ||
            recipeBlendCategory === undefined) {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                _id: { $in: recipeIds },
            };
            recipesSize = recipeIds.length;
        }
        else {
            find = {
                name: { $regex: searchTerm, $options: 'i' },
                recipeBlendCategory: new mongoose_1.default.mongo.ObjectId(recipeBlendCategory),
                _id: { $in: recipeIds },
            };
            let recipes = await recipe_1.default.find(find).select('_id');
            recipesSize = recipes.length;
        }
        let recipes = await recipe_1.default.find(find)
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
            },
        })
            .populate('brand')
            .populate('recipeBlendCategory')
            .limit(limit)
            .skip(limit * (page - 1))
            .lean();
        return {
            recipes: recipes,
            totalRecipe: recipesSize,
        };
    }
    async addToGroceryFromPlanner(memberId, recipeId) {
        let recipe = await recipe_1.default.findOne({ _id: recipeId }).select('ingredients');
        let member = await memberModel_1.default.findOne({ _id: memberId });
        if (!recipe || !member) {
            return new AppError_1.default('Recipe or member not found', 404);
        }
        let groceryList = await GroceryList_1.default.findOne({
            memberId: memberId,
        });
        let groceryIngredients = [];
        if (groceryList) {
            for (let i = 0; i < recipe.ingredients.length; i++) {
                if (!groceryList.list.filter(
                //@ts-ignore
                (item) => String(item.ingredientId) ===
                    String(recipe.ingredients[i].ingredientId))[0]) {
                    groceryIngredients.push({
                        ingredientId: recipe.ingredients[i].ingredientId,
                        selectedPortion: recipe.ingredients[i].selectedPortion.name,
                        quantity: recipe.ingredients[i].selectedPortion.quantity,
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
    __param(1, (0, type_graphql_1.Arg)('limit')),
    __param(2, (0, type_graphql_1.Arg)('page')),
    __param(3, (0, type_graphql_1.Arg)('searchTerm')),
    __param(4, (0, type_graphql_1.Arg)('recipeBlendCategory', { nullable: true })),
    __param(5, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, Number, String, String, String]),
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
