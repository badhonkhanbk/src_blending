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
const CreateNewPlan_1 = __importDefault(require("./input-type/planInput/CreateNewPlan"));
const Plan_1 = __importDefault(require("../../../models/Plan"));
const EditPlan_1 = __importDefault(require("./input-type/planInput/EditPlan"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const Plan_2 = __importDefault(require("../schemas/PlanSchema/Plan"));
const PlanIngredientAndCategory_1 = __importDefault(require("../schemas/PlanSchema/PlanIngredientAndCategory"));
const getRecipeCategoryPercentage_1 = __importDefault(require("./utils/getRecipeCategoryPercentage"));
const getIngredientStats_1 = __importDefault(require("./utils/getIngredientStats"));
const PlanWithTotal_1 = __importDefault(require("../schemas/PlanSchema/PlanWithTotal"));
const planShare_1 = __importDefault(require("../../../models/planShare"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const PlansAndRecipes_1 = __importDefault(require("../schemas/PlanSchema/PlansAndRecipes"));
const checkThePlanIsInCollectionOrNot_1 = __importDefault(require("./utils/checkThePlanIsInCollectionOrNot"));
const attachCommentsCountWithPlan_1 = __importDefault(require("./utils/attachCommentsCountWithPlan"));
const planCollection_1 = __importDefault(require("../../../models/planCollection"));
const PlanRating_1 = __importDefault(require("../../../models/PlanRating"));
const updatePlanFacts_1 = __importDefault(require("../../recipe/resolvers/util/updatePlanFacts"));
const FilterPlan_1 = __importDefault(require("./input-type/planInput/FilterPlan"));
let PlanResolver = class PlanResolver {
    async createAPlan(input) {
        let myPlan = input;
        if (input.startDateString) {
            myPlan.startDate = new Date(new Date(input.startDateString.toString()).toISOString().slice(0, 10));
        }
        if (input.endDateString) {
            myPlan.endDate = new Date(new Date(input.endDateString.toString()).toISOString().slice(0, 10));
        }
        //TODO
        myPlan.isGlobal = true;
        let plan = await Plan_1.default.create(myPlan);
        await (0, updatePlanFacts_1.default)(String(plan._id));
        return 'Plan created';
    }
    async updateAPlan(input) {
        let plan = await Plan_1.default.findOne({ _id: input.editId }).select('memberId');
        if (String(plan.memberId) !== input.memberId) {
            return new AppError_1.default('You are not authorized to edit this plan', 401);
        }
        let myPlan = input.editableObject;
        if (input.editableObject.startDateString) {
            myPlan.startDate = new Date(new Date(input.editableObject.startDateString.toString())
                .toISOString()
                .slice(0, 10));
        }
        if (input.editableObject.endDateString) {
            myPlan.endDate = new Date(new Date(input.editableObject.endDateString.toString())
                .toISOString()
                .slice(0, 10));
        }
        myPlan.updatedAt = Date.now();
        await Plan_1.default.findOneAndUpdate({
            _id: input.editId,
        }, myPlan, {
            new: true,
        });
        await (0, updatePlanFacts_1.default)(String(plan._id));
        return 'Plan updated';
    }
    async getMyPlans(memberId) {
        let plans = await Plan_1.default.find({ memberId: memberId }).populate('planData.recipes');
        return plans;
    }
    async getAPlan(planId, token, memberId) {
        let plan = await Plan_1.default.findOne({
            _id: planId,
        }).populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName featuredImage',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        });
        let recipeCategories = [];
        let ingredients = [];
        for (let i = 0; i < plan.planData.length; i++) {
            if (plan.planData[i].recipes.length > 0) {
                for (let j = 0; j < plan.planData[i].recipes.length; j++) {
                    recipeCategories.push({
                        //@ts-ignore
                        _id: plan.planData[i].recipes[j].recipeBlendCategory
                            ? plan.planData[i].recipes[j].recipeBlendCategory._id
                            : null,
                        //@ts-ignore
                        name: plan.planData[i].recipes[j].recipeBlendCategory.name,
                    });
                    //defaultVersion
                    //ingredients
                    for (let k = 0; 
                    //@ts-ignore
                    k < plan.planData[i].recipes[j].defaultVersion.ingredients.length; k++) {
                        ingredients.push({
                            //@ts-ignore
                            _id: plan.planData[i].recipes[j].defaultVersion.ingredients[k]
                                .ingredientId._id,
                            //@ts-ignore
                            name: plan.planData[i].recipes[j].defaultVersion.ingredients[k]
                                .ingredientId.ingredientName,
                            featuredImage: 
                            //@ts-ignore
                            plan.planData[i].recipes[j].defaultVersion.ingredients[k]
                                .ingredientId.featuredImage,
                        });
                    }
                }
            }
        }
        let categoryPercentages = await (0, getRecipeCategoryPercentage_1.default)(recipeCategories);
        let ingredientsStats = await (0, getIngredientStats_1.default)(ingredients);
        if (memberId) {
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            plan.planCollectionsDescription = await planCollection_1.default.find({
                memberId: memberId,
                plans: {
                    $in: planId,
                },
            });
            // console.log(plan.planCollectionDescription);
        }
        return {
            plan: plan,
            topIngredients: ingredientsStats,
            recipeCategoriesPercentage: categoryPercentages,
            macroMakeup: await this.averageCarbsProteinFatsForAPlanner(planId),
        };
    }
    async averageCarbsProteinFatsForAPlanner(planId) {
        let returnData = {};
        let plan = await Plan_1.default.findOne({
            _id: planId,
        });
        if (!plan) {
            return {
                carbs: 0,
                protein: 0,
                fats: 0,
            };
        }
        let numberOfDays = 0;
        for (let i = 0; i < plan.planData.length; i++) {
            if (plan.planData[i].recipes.length > 0) {
                numberOfDays++;
            }
        }
        if (numberOfDays === 0) {
            return {
                carbs: 0,
                protein: 0,
                fats: 0,
            };
        }
        let protein = plan.energy.filter((item) => String(item.blendNutrientRefference) === '620b4607b82695d67f28e196')[0];
        if (!protein) {
            returnData.protein = 0;
        }
        else {
            returnData.protein = protein.value / numberOfDays;
        }
        let fats = plan.energy.filter((item) => String(item.blendNutrientRefference) === '620b4607b82695d67f28e199')[0];
        if (!fats) {
            returnData.fats = 0;
        }
        else {
            returnData.fats = fats.value / numberOfDays;
        }
        let carbs = plan.energy.filter((item) => String(item.blendNutrientRefference) === '620b4608b82695d67f28e19c')[0];
        if (!carbs) {
            returnData.carbs = 0;
        }
        else {
            returnData.carbs = carbs.value / numberOfDays;
        }
        return returnData;
    }
    // async getIngredientsStats(recipes: any[]) {
    //   let ingredients: any = {};
    //   for (let i = 0; i < recipes.length; i++) {
    //     if (ingredients[recipes[i].name]) {
    //       ingredients[recipes[i].name].count += 1;
    //     } else {
    //       ingredients[recipes[i].name] = {
    //         ...recipes[i],
    //         count: 1,
    //       };
    //     }
    //   }
    //   let keys = Object.keys(ingredients);
    //   let sortedIngredients = keys
    //     .map((key: any) => ingredients[key])
    //     .sort((a: any, b: any) => b.count - a.count)
    //     .slice(0, 5);
    //   console.log(sortedIngredients);
    //   return sortedIngredients;
    // }
    // async getRecipeCategoryPercentage(recipeIds: any[]) {
    //   let categories: any = {};
    //   for (let i = 0; i < recipeIds.length; i++) {
    //     if (categories[recipeIds[i].name]) {
    //       categories[recipeIds[i].name].count += 1;
    //       let percentage =
    //         (categories[recipeIds[i].name].count / recipeIds.length) * 100;
    //       categories[recipeIds[i].name].percentage = percentage;
    //     } else {
    //       categories[recipeIds[i].name] = {
    //         ...recipeIds[i],
    //         count: 1,
    //         percentage: (1 / recipeIds.length) * 100,
    //       };
    //     }
    //   }
    //   let keys = Object.keys(categories);
    //   let sortedCategories = keys
    //     .map((key: any) => categories[key])
    //     .sort((a, b) => b.percentage - a.percentage);
    //   console.log(sortedCategories);
    //   return sortedCategories;
    // }
    async deletePlan(planId, memberId) {
        let plan = await Plan_1.default.findOne({ _id: planId }).select('memberId');
        if (String(plan.memberId) !== memberId) {
            return new AppError_1.default('You are not authorized to edit this plan', 401);
        }
        await Plan_1.default.findOneAndDelete({
            _id: planId,
        });
        return 'Plan deleted';
    }
    async getAllGlobalPlans(page, limit, searchTerm, memberId) {
        let plans = [];
        if (page && limit) {
            plans = await Plan_1.default.find({
                planName: { $regex: searchTerm, $options: 'i' },
                isGlobal: true,
            })
                .populate({
                path: 'planData.recipes',
                populate: [
                    {
                        path: 'defaultVersion',
                        populate: {
                            path: 'ingredients.ingredientId',
                            model: 'BlendIngredient',
                            select: 'ingredientName',
                        },
                        select: 'postfixTitle ingredients',
                    },
                    {
                        path: 'brand',
                    },
                    {
                        path: 'recipeBlendCategory',
                    },
                ],
            })
                .sort({ createdAt: -1 })
                .limit(limit)
                .skip(limit * (page - 1));
        }
        else {
            plans = await Plan_1.default.find({
                planName: { $regex: searchTerm, $options: 'i' },
                isGlobal: true,
            })
                .populate({
                path: 'planData.recipes',
                populate: [
                    {
                        path: 'defaultVersion',
                        populate: {
                            path: 'ingredients.ingredientId',
                            model: 'BlendIngredient',
                            select: 'ingredientName',
                        },
                        select: 'postfixTitle ingredients',
                    },
                    {
                        path: 'brand',
                    },
                    {
                        path: 'recipeBlendCategory',
                    },
                ],
            })
                .sort({ createdAt: -1 });
        }
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
        };
    }
    async getAllRecentPlans(page, limit, memberId) {
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit || limit < 1) {
            limit = 10;
        }
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
        };
    }
    async searchPlans(searchTerm, memberId) {
        let plans = await Plan_1.default.find({
            planName: { $regex: searchTerm, $options: 'i' },
            isGlobal: true,
        })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .lean()
            .sort({ planName: 1 });
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return planWithCollectionAndComments;
    }
    async getAllRecommendedPlans(page, limit, memberId) {
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit || limit < 1) {
            limit = 10;
        }
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
        };
    }
    async getAllPopularPlans(page, limit, memberId) {
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit || limit < 1) {
            limit = 10;
        }
        let plans = await Plan_1.default.find({ isGlobal: true })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: 1 })
            .limit(limit)
            .skip(limit * (page - 1));
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, memberId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: memberId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
        };
    }
    //planName: { $regex: searchTerm, $options: 'i' },
    async filterPlans(data, userId, page, limit) {
        console.log(data.collectionsIds);
        let isSearchTerm = data.searchTerm === '' || data.searchTerm === null;
        if (
        //@ts-ignore
        data.includeIngredientIds.length == 0 &&
            //@ts-ignore
            data.nutrientFilters.length == 0 &&
            //@ts-ignore
            data.nutrientMatrix.length == 0 &&
            //@ts-ignore
            data.excludeIngredientIds.length == 0 &&
            //@ts-ignore
            data.collectionsIds.length == 0 &&
            isSearchTerm) {
            return {
                plans: [],
                totalRecipes: 0,
            };
        }
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 5;
        }
        let planData = [];
        let find = {
        // global: true,
        // userId: null,
        // addedByAdmin: true,
        // discovery: true,
        // isPublished: true,
        };
        if (data.includeIngredientIds.length > 0) {
            find.ingredients = { $in: data.includeIngredientIds };
        }
        if (data.collectionsIds.length > 0) {
            let allRecipeIds = [];
            for (let i = 0; i < data.collectionsIds.length; i++) {
                let collection = await planCollection_1.default.findOne({
                    _id: data.collectionsIds[i],
                });
                if (!collection) {
                    continue;
                }
                // console.log(collection.recipes);
                allRecipeIds = allRecipeIds.concat(collection.plans);
            }
            if (allRecipeIds.length !== 0) {
                let recipeIdsSet = new Set(allRecipeIds);
                let uniqueRecipeArray = Array.from(recipeIdsSet);
                console.log(uniqueRecipeArray);
                find._id = {
                    $in: uniqueRecipeArray,
                };
            }
            else {
                find._id = {
                    $in: [],
                };
            }
        }
        if (!isSearchTerm) {
            find.planName = { $regex: data.searchTerm, $options: 'i' };
        }
        console.log('d', find);
        let findKeys = Object.keys(find);
        // console.log('f', find);
        if (findKeys.length > 0) {
            planData = await Plan_1.default.find(find).select('_id');
        }
        else {
            planData = [];
        }
        if (planData.length > 0 && data.excludeIngredientIds.length > 0) {
            let planIds = planData.map((plan) => plan._id);
            planData = await Plan_1.default.find({
                _id: { $in: planIds },
                ingredients: { $nin: data.excludeIngredientIds },
            }).select('_id');
        }
        let findfacts = {
        // global: true,
        // userId: null,
        // addedByAdmin: true,
        // discovery: true,
        // isPublished: true,
        };
        if (planData.length > 0) {
            let planIds = planData.map((plan) => plan._id);
            findfacts = {
                _id: { $in: planIds },
            };
        }
        else {
            findfacts = {
                _id: { $in: [] },
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
        let planFacts = [];
        let planIds = [];
        if (energy.length > 0) {
            for (let i = 0; i < energy.length; i++) {
                findfacts['energy'] = { $elemMatch: energy[i] };
                planFacts = await Plan_1.default.find(findfacts).select('_id');
                planIds = planFacts.map((plan) => plan._id);
                findfacts._id = { $in: planIds };
                delete findfacts['energy'];
            }
        }
        if (mineral.length > 0) {
            for (let i = 0; i < mineral.length; i++) {
                findfacts['mineral'] = { $elemMatch: mineral[i] };
                planFacts = await Plan_1.default.find(findfacts).select('_id');
                planIds = planFacts.map((plan) => plan._id);
                findfacts._id = { $in: planIds };
                delete findfacts['mineral'];
            }
        }
        if (vitamin.length > 0) {
            for (let i = 0; i < vitamin.length; i++) {
                findfacts['vitamin'] = { $elemMatch: vitamin[i] };
                planFacts = await Plan_1.default.find(findfacts).select('_id');
                planIds = planFacts.map((plan) => plan._id);
                findfacts._id = { $in: planIds };
                delete findfacts['vitamin'];
            }
        }
        if (planIds.length === 0) {
            planFacts = await Plan_1.default.find(findfacts).select('_id');
            planIds = planFacts.map((plan) => plan._id);
            // recipeIds = [];
        }
        console.log('pid', planIds);
        let plans = await Plan_1.default.find({
            _id: {
                $in: planIds,
            },
        })
            .populate({
            path: 'planData.recipes',
            populate: [
                {
                    path: 'defaultVersion',
                    populate: {
                        path: 'ingredients.ingredientId',
                        model: 'BlendIngredient',
                        select: 'ingredientName',
                    },
                    select: 'postfixTitle ingredients',
                },
                {
                    path: 'brand',
                },
                {
                    path: 'recipeBlendCategory',
                },
            ],
        })
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(limit * (page - 1));
        let planWithCollectionAndComments = [];
        for (let i = 0; i < plans.length; i++) {
            let plan = plans[i];
            plan.commentsCount = await (0, attachCommentsCountWithPlan_1.default)(plan._id);
            plan.planCollections = await (0, checkThePlanIsInCollectionOrNot_1.default)(plan._id, userId);
            let myPlanRating = await PlanRating_1.default.findOne({
                memberId: userId,
                planId: plan._id,
            });
            if (myPlanRating) {
                plan.myRating = myPlanRating.rating;
            }
            else {
                plan.myRating = 0;
            }
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: planIds.length > 0
                ? await Plan_1.default.countDocuments({ _id: planIds })
                : 0,
        };
    }
    async sharePlan(planId, memberId) {
        let planShare = await planShare_1.default.findOne({
            planId: planId,
            invitedBy: memberId,
        });
        if (!planShare) {
            let newPlanShare = await planShare_1.default.create({
                planId: planId,
                invitedBy: memberId,
            });
            return newPlanShare._id;
        }
        return planShare._id;
    }
    async getPlanShareInfo(planShareId) {
        let planShare = await planShare_1.default.findOne({
            _id: planShareId,
        });
        if (!planShare) {
            return new AppError_1.default('Plan share not found', 404);
        }
        let plan = await Plan_1.default.findOne({
            _id: planShare.planId,
        });
        let recipeCounts = 0;
        let recipeIds = [];
        for (let i = 0; i < plan.planData.length; i++) {
            for (let j = 0; j < plan.planData[i].recipes.length; j++) {
                recipeIds.push(String(plan.planData[i].recipes[j]));
                recipeCounts++;
            }
        }
        let recipeIdsSet = [...new Set(recipeIds)].slice(0, 3);
        let recipes = await recipe_1.default.find({
            _id: { $in: recipeIdsSet },
        })
            .populate('recipeBlendCategory')
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
            .populate('brand');
        let invitedBy = await memberModel_1.default.findOne({
            _id: planShare.invitedBy,
        });
        return {
            plan: plan,
            recipeCount: recipeCounts,
            invitedBy: invitedBy,
            recipes: recipes,
        };
    }
    async fixPlans() {
        let plans = await Plan_1.default.find();
        for (let i = 0; i < plans.length; i++) {
            console.log(i);
            await (0, updatePlanFacts_1.default)(String(plans[i]._id));
        }
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewPlan_1.default]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "createAPlan", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('input')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditPlan_1.default]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "updateAPlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getMyPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanIngredientAndCategory_1.default),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __param(1, (0, type_graphql_1.Arg)('token', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('memberId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAPlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "averageCarbsProteinFatsForAPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "deletePlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('searchTerm')),
    __param(3, (0, type_graphql_1.Arg)('memberId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllGlobalPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllRecentPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Plan_2.default]),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "searchPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllRecommendedPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number, String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getAllPopularPlans", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlanWithTotal_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterPlan_1.default,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "filterPlans", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "sharePlan", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlansAndRecipes_1.default),
    __param(0, (0, type_graphql_1.Arg)('planShareId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "getPlanShareInfo", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlanResolver.prototype, "fixPlans", null);
PlanResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanResolver);
exports.default = PlanResolver;
