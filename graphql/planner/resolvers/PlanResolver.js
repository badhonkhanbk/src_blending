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
        await Plan_1.default.create(myPlan);
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
        console.log(myPlan);
        await Plan_1.default.findOneAndUpdate({
            _id: input.editId,
        }, myPlan);
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
        };
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
            planWithCollectionAndComments.push(plan);
        }
        return {
            plans: planWithCollectionAndComments,
            totalPlans: await Plan_1.default.countDocuments({ isGlobal: true }),
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
        await Plan_1.default.updateMany({}, {
            image: {
                url: '',
                hash: '',
            },
        });
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
