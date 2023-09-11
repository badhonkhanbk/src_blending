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
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const PlannerInsights_1 = __importDefault(require("../schemas/PlannerInsights"));
const addToGroceryFromRecipe_1 = __importDefault(require("./utils/addToGroceryFromRecipe"));
const getSearchedBlendNutrition_1 = __importDefault(require("../../blendIngredientsdata/resolvers/util/getSearchedBlendNutrition"));
const getGlAndNetCarbs2_1 = __importDefault(require("../../blendIngredientsdata/resolvers/util/getGlAndNetCarbs2"));
var MergeOrReplace;
(function (MergeOrReplace) {
    MergeOrReplace["MERGE"] = "MERGE";
    MergeOrReplace["REPLACE"] = "REPLACE";
})(MergeOrReplace || (MergeOrReplace = {}));
(0, type_graphql_1.registerEnumType)(MergeOrReplace, {
    name: 'mergerOrRemove',
    description: 'The basic directions', // this one is optional
});
let PlannerResolver = class PlannerResolver {
    /**
     * Creates a planner based on the provided data.
     *
     * @param {CreatePlanner} data - The data used to create the planner.
     * @return {Promise<Planner>} - A promise that resolves to the created planner.
     */
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
    /**
     * Move planner.
     *
     * @param {MovePlanner} data - The data for moving the planner.
     * @return {Promise<any>} The moved planner.
     */
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
    /**
     * Deletes a planner and removes a recipe from it.
     *
     * @param {String} plannerId - The ID of the planner to delete.
     * @param {String} recipeId - The ID of the recipe to remove from the planner.
     * @return {String} The result message indicating the status of the operation.
     */
    async deletePlanner(plannerId, recipeId) {
        let planner = await Planner_1.default.findOneAndUpdate({ _id: plannerId }, { $pull: { recipes: recipeId } }, { new: true }).select('recipes');
        if (planner.recipes.length === 0) {
            await Planner_1.default.findByIdAndDelete(plannerId);
            return 'Planner Deleted';
        }
        //NOTE:
        return 'Planner recipe removed';
    }
    /**
     * Retrieves a planner based on the specified start and end dates, and user ID.
     *
     * @param {string} startDate - The start date of the planner.
     * @param {string} endDate - The end date of the planner.
     * @param {String} userId - The ID of the user.
     * @return {Promise<Object>} - The planner, top ingredients, and recipe categories percentage.
     */
    async getPlannerByDates(startDate, endDate, userId) {
        let startDateISO = new Date(startDate);
        let endDateISO = new Date(endDate);
        let macroMakeUp = {
            carbs: 0,
            protein: 0,
            fats: 0,
        };
        let days = await this.getDifferenceInDays(startDateISO, endDateISO);
        let planners = [];
        let recipeCategories = [];
        let ingredients = [];
        let ingredientInfo = [];
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
                        select: 'ingredientName selectedImage featuredImage',
                    },
                })
                    .lean();
                // console.log(userProfileRecipes.length);
                let returnRecipe = await (0, getNotesCompareAndUserCollectionsForPlanner_1.default)(userId, userProfileRecipes);
                planner.ProfileRecipes = returnRecipe;
                planners.push(planner);
                // console.log(planner);
                if (userProfileRecipes.length > 0) {
                    for (let j = 0; j < userProfileRecipes.length; j++) {
                        recipeCategories.push({
                            //@ts-ignore
                            _id: userProfileRecipes[j].recipeId.recipeBlendCategory._id,
                            //@ts-ignore
                            name: userProfileRecipes[j].recipeId.recipeBlendCategory.name,
                        });
                        // console.log(userProfileRecipes[j]._id);
                        for (let k = 0; 
                        //@ts-ignore
                        k < userProfileRecipes[j].defaultVersion.ingredients.length; k++) {
                            // console.log(k);
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
                            // console.log(k);
                            ingredientInfo.push({
                                ingredientId: String(userProfileRecipes[j].defaultVersion.ingredients[k]
                                    .ingredientId._id),
                                value: userProfileRecipes[j].defaultVersion.ingredients[k]
                                    .weightInGram,
                            });
                        }
                        let protein = userProfileRecipes[j].defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) ===
                            '620b4607b82695d67f28e196')[0];
                        if (!protein) {
                            macroMakeUp.protein += 0;
                        }
                        else {
                            macroMakeUp.protein += protein.value;
                        }
                        let fats = userProfileRecipes[j].defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) ===
                            '620b4607b82695d67f28e199')[0];
                        if (!fats) {
                            macroMakeUp.fats += 0;
                        }
                        else {
                            macroMakeUp.fats += fats.value;
                        }
                        let carbs = userProfileRecipes[j].defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) ===
                            '620b4608b82695d67f28e19c')[0];
                        if (!carbs) {
                            macroMakeUp.carbs += 0;
                        }
                        else {
                            macroMakeUp.carbs += carbs.value;
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
        if (macroMakeUp.protein !== 0) {
            macroMakeUp.protein = macroMakeUp.protein / days;
        }
        if (macroMakeUp.fats !== 0) {
            macroMakeUp.fats = macroMakeUp.fats / days;
        }
        if (macroMakeUp.carbs !== 0) {
            macroMakeUp.carbs = macroMakeUp.carbs / days;
        }
        // console.log(ingredientInfo);
        // console.log(2);
        let res2 = await (0, getGlAndNetCarbs2_1.default)(ingredientInfo);
        // console.log(2);
        let res = await (0, getSearchedBlendNutrition_1.default)(ingredientInfo, [
            '620b4606b82695d67f28e193',
        ]);
        // console.log(planners);
        return {
            planners,
            topIngredients: ingredientsStats,
            recipeCategoriesPercentage: categoryPercentages,
            macroMakeup: macroMakeUp,
            calorie: res[0].value,
            netCarbs: res2.netCarbs,
            rxScore: 0,
        };
    }
    async getPlannerInsights(userId, recipeIds, numberOfDays) {
        let macroMakeUp = {
            carbs: 0,
            protein: 0,
            fats: 0,
        };
        let user = await memberModel_1.default.findOne({ _id: userId }).select('_id');
        if (!user) {
            return new AppError_1.default('user not Found', 404);
        }
        // let macroInfo = user.macroInfo.map((mi) => {
        //   return {
        //     //@ts-ignore
        //     nutrientName: mi.blendNutrientId.nutrientName,
        //     percentage: mi.percentage,
        //   };
        // });
        let recipeCategories = [];
        let ingredients = [];
        let ingredientInfo = [];
        const recipeCounts = {};
        recipeIds.forEach(function (recipeId) {
            recipeCounts[recipeId.toString()] =
                (recipeCounts[recipeId.toString()] || 0) + 1;
        });
        console.log(recipeCounts);
        let uniqueIds = Object.keys(recipeCounts);
        for (let i = 0; i < uniqueIds.length; i++) {
            let userProfileRecipe = await UserRecipeProfile_1.default.findOne({
                userId: userId,
                recipeId: uniqueIds[i],
            })
                .populate({
                path: 'recipeId',
                model: 'RecipeModel',
                populate: [
                    {
                        path: 'recipeBlendCategory',
                        model: 'RecipeCategory',
                        select: 'name',
                    },
                ],
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
                .select('recipeId defaultVersion')
                .lean();
            if (!userProfileRecipe) {
                continue;
            }
            let recipeCount = recipeCounts[uniqueIds[i]];
            for (let recipeCountS = 0; recipeCountS < recipeCount; recipeCountS++) {
                recipeCategories.push({
                    //@ts-ignore
                    _id: userProfileRecipe.recipeId.recipeBlendCategory._id,
                    //@ts-ignore
                    name: userProfileRecipe.recipeId.recipeBlendCategory.name,
                });
            }
            for (let k = 0; 
            //@ts-ignore
            k < userProfileRecipe.defaultVersion.ingredients.length; k++) {
                for (let recipeCountS = 0; recipeCountS < recipeCount; recipeCountS++) {
                    ingredients.push({
                        //@ts-ignore
                        _id: userProfileRecipe.defaultVersion.ingredients[k].ingredientId
                            ._id,
                        //@ts-ignore
                        name: userProfileRecipe.defaultVersion.ingredients[k].ingredientId
                            .ingredientName,
                        value: userProfileRecipe.defaultVersion.ingredients[k].weightInGram,
                        featuredImage: 
                        //@ts-ignore
                        userProfileRecipe.defaultVersion.ingredients[k].ingredientId
                            .featuredImage,
                    });
                    ingredientInfo.push({
                        ingredientId: String(userProfileRecipe.defaultVersion.ingredients[k].ingredientId._id),
                        value: userProfileRecipe.defaultVersion.ingredients[k].weightInGram,
                    });
                }
            }
            let protein = userProfileRecipe.defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) === '620b4607b82695d67f28e196')[0];
            if (!protein) {
                macroMakeUp.protein += 0;
            }
            else {
                macroMakeUp.protein += protein.value * recipeCount;
            }
            let fats = userProfileRecipe.defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) === '620b4607b82695d67f28e199')[0];
            if (!fats) {
                macroMakeUp.fats += 0;
            }
            else {
                macroMakeUp.fats += fats.value * recipeCount;
            }
            let carbs = userProfileRecipe.defaultVersion.energy.filter((item) => String(item.blendNutrientRefference) === '620b4608b82695d67f28e19c')[0];
            if (!carbs) {
                macroMakeUp.carbs += 0;
            }
            else {
                macroMakeUp.carbs += carbs.value * recipeCount;
            }
        }
        if (macroMakeUp.protein !== 0) {
            macroMakeUp.protein = macroMakeUp.protein / numberOfDays;
        }
        if (macroMakeUp.fats !== 0) {
            macroMakeUp.fats = macroMakeUp.fats / numberOfDays;
        }
        if (macroMakeUp.carbs !== 0) {
            macroMakeUp.carbs = macroMakeUp.carbs / numberOfDays;
        }
        let categoryPercentages = await (0, getRecipeCategoryPercentage_1.default)(recipeCategories);
        let ingredientsStats = await (0, getIngredientStats_1.default)(ingredients);
        console.log(2);
        let res2 = await (0, getGlAndNetCarbs2_1.default)(ingredientInfo);
        console.log(2);
        let res = await (0, getSearchedBlendNutrition_1.default)(ingredientInfo, [
            '620b4606b82695d67f28e193',
        ]);
        // console.log(res);
        // console.log(res2);
        return {
            topIngredients: ingredientsStats,
            recipeCategoriesPercentage: categoryPercentages,
            macroMakeup: macroMakeUp,
            calorie: res[0].value,
            netCarbs: res2.netCarbs,
            rxScore: 0,
        };
    }
    /**
     * Calculates the difference in days between two dates.
     *
     * @param {any} date1 - The first date.
     * @param {any} date2 - The second date.
     * @return {number} The difference in days.
     */
    async getDifferenceInDays(date1, date2) {
        const diffInMs = Math.abs(date2 - date1);
        return diffInMs / (1000 * 60 * 60 * 24);
    }
    /**
     * Clears the planner for a given date range and user.
     *
     * @param {string} startDate - The start date of the date range.
     * @param {string} endDate - The end date of the date range.
     * @param {String} userId - The ID of the user.
     * @return {Promise<string>} A message indicating that the planner was successfully cleared.
     */
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
    /**
     * Retrieves all planners associated with a specific user ID.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} A promise that resolves to an array of planner objects.
     */
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
                select: 'ingredientName selectedImage featuredImage portions',
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
    /**
     * Retrieves a list of planners for a given user within a specified date range.
     *
     * @param {String} userId - The ID of the user.
     * @param {string} startDate - The start date of the date range in ISO format.
     * @param {string} endDate - The end date of the date range in ISO format.
     * @return {Promise<{ recipes: any[]; totalRecipe: number }>} An object containing the list of recipes and the total number of recipes.
     */
    async getQuedPlanner(userId, 
    // @Arg('limit') limit: number,
    // @Arg('page') page: number,
    // @Arg('searchTerm') searchTerm: String,
    // @Arg('recipeBlendCategory', { nullable: true }) recipeBlendCategory: string,
    startDate, endDate
    // @Arg('currentDate', { nullable: true }) currentDate: string
    ) {
        let startDateISO = new Date(startDate).toISOString();
        let endDateISO = new Date(endDate).toISOString();
        // if (currentDate) {
        //   let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        //   console.log(today);
        //   startDateISO = new Date(
        //     today.setDate(today.getDate() - today.getDay() + 0)
        //   );
        //   endDateISO = new Date(today.setDate(today.getDate() + 6));
        // }
        let planners = await Planner_1.default.find({
            memberId: userId,
            assignDate: {
                $gte: startDateISO,
                $lte: endDateISO,
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
    /**
     * Adds a recipe from the planner to the grocery list for a specific member.
     *
     * @param {String} memberId - The ID of the member.
     * @param {String} recipeId - The ID of the recipe.
     * @return {Promise<string>} A string indicating the result of the operation.
     */
    async addToGroceryFromPlanner(memberId, recipeId) {
        await (0, addToGroceryFromRecipe_1.default)(recipeId, memberId);
        return 'successfully added to grocery';
    }
    /**
     * Merges or replaces the planner data for a specific date range and member.
     *
     * @param {string} startDate - The start date of the date range.
     * @param {String} endDate - The end date of the date range (nullable).
     * @param {String} memberId - The ID of the member.
     * @param {String} planId - The ID of the plan.
     * @param {MergeOrReplace} mergeOrReplace - The mode for merging or replacing the planner data.
     * @return {Promise<string>} A promise that resolves to 'done' when the operation is complete.
     */
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
    /**
     * Merges the given plan data to the planner for a specific member.
     *
     * @param {any[]} planData - An array of plan data to be merged.
     * @param {Date} tempDate - The temporary date for merging.
     * @param {String} memberId - The ID of the member.
     * @return {Promise<string>} A Promise that resolves to 'done' when the merging is complete.
     */
    async mergeToPlanner(planData, tempDate, memberId) {
        for (let i = 0; i < 7; i++) {
            let planner = await Planner_1.default.findOne({
                memberId: memberId,
                assignDate: tempDate,
            });
            let recipes = planData[i].recipes.map((recipe) => String(recipe));
            await this.checkForExistenceInTheUserProfileRecipes(recipes, memberId);
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
    /**
     * Replaces the planner data with new data.
     *
     * @param {any[]} planData - An array of planner data.
     * @param {Date} tempDate - The temporary date.
     * @param {String} memberId - The ID of the member.
     * @return {Promise<string>} A promise that resolves to 'done' when the operation is complete.
     */
    async replaceToPlanner(planData, tempDate, memberId) {
        for (let i = 0; i < 7; i++) {
            let planner = await Planner_1.default.findOne({
                memberId: memberId,
                assignDate: tempDate,
            });
            let recipes = planData[i].recipes.map((recipe) => String(recipe));
            await this.checkForExistenceInTheUserProfileRecipes(recipes, memberId);
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
    /**
     * Check for existence in the user profile recipes.
     *
     * @param {any[]} recipes - The array of recipes to check.
     * @param {String} memberId - The ID of the member.
     * @return {Promise<string>} The result of the function.
     */
    async checkForExistenceInTheUserProfileRecipes(recipes, memberId) {
        for (let i = 0; i < recipes.length; i++) {
            let userRecipe = await UserRecipeProfile_1.default.findOne({
                recipeId: recipes[i],
                userId: memberId,
            }).select('_id');
            if (!userRecipe) {
                let recipe = await recipeModel_1.default.findOne({
                    _id: recipes[i],
                });
                await UserRecipeProfile_1.default.create({
                    recipeId: recipes[i],
                    userId: memberId,
                    isMatch: recipes[i].isMatch,
                    allRecipes: false,
                    myRecipes: false,
                    turnedOffVersions: recipes[i].turnedOffVersion,
                    turnedOnVersions: recipes[i].turnedOnVersions,
                    defaultVersion: recipes[i].defaultVersion,
                });
            }
        }
        return 'done';
    }
    /**
     * Fix the error ingredients in all recipe versions.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the fix is completed.
     */
    async fixV() {
        await RecipeVersionModel_1.default.updateMany({
            errorIngredients: null,
        }, {
            errorIngredients: [],
        });
        return 'done';
    }
    async n() {
        let planners = await Planner_1.default.find();
        for (let i = 0; i < planners.length; i++) {
            let otherPlanners = await Planner_1.default.find({
                memberId: planners[i].memberId,
                formatedDate: planners[i].formatedDate,
                _id: { $ne: planners[i]._id },
            }).select('_id');
            let ids = otherPlanners.map((op) => op._id);
            planners.length = planners.length - ids.length;
            await Planner_1.default.deleteMany({
                _id: { $in: ids },
            });
        }
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Planner_2.default)
    /**
     * Creates a planner based on the provided data.
     *
     * @param {CreatePlanner} data - The data used to create the planner.
     * @return {Promise<Planner>} - A promise that resolves to the created planner.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlanner_1.default]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "createPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Planner_2.default)
    /**
     * Move planner.
     *
     * @param {MovePlanner} data - The data for moving the planner.
     * @return {Promise<any>} The moved planner.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [MovePlanner_1.default]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "movePlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Deletes a planner and removes a recipe from it.
     *
     * @param {String} plannerId - The ID of the planner to delete.
     * @param {String} recipeId - The ID of the recipe to remove from the planner.
     * @return {String} The result message indicating the status of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('plannerId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "deletePlanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlannersIngredientAndCategoryPercentage_1.default)
    /**
     * Retrieves a planner based on the specified start and end dates, and user ID.
     *
     * @param {string} startDate - The start date of the planner.
     * @param {string} endDate - The end date of the planner.
     * @param {String} userId - The ID of the user.
     * @return {Promise<Object>} - The planner, top ingredients, and recipe categories percentage.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('startDate')),
    __param(1, (0, type_graphql_1.Arg)('endDate')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getPlannerByDates", null);
__decorate([
    (0, type_graphql_1.Query)(() => PlannerInsights_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('recipeIds', (type) => [String])),
    __param(2, (0, type_graphql_1.Arg)('numberOfDays')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array, Number]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getPlannerInsights", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Clears the planner for a given date range and user.
     *
     * @param {string} startDate - The start date of the date range.
     * @param {string} endDate - The end date of the date range.
     * @param {String} userId - The ID of the user.
     * @return {Promise<string>} A message indicating that the planner was successfully cleared.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('startDate')),
    __param(1, (0, type_graphql_1.Arg)('endDate')),
    __param(2, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "clearPlannerByDates", null);
__decorate([
    (0, type_graphql_1.Query)(() => [PlannerWithRecipes_1.default])
    /**
     * Retrieves all planners associated with a specific user ID.
     *
     * @param {String} userId - The ID of the user.
     * @return {Promise} A promise that resolves to an array of planner objects.
     */
    ,
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
    (0, type_graphql_1.Query)(() => PlannerRecipe_1.default)
    /**
     * Retrieves a list of planners for a given user within a specified date range.
     *
     * @param {String} userId - The ID of the user.
     * @param {string} startDate - The start date of the date range in ISO format.
     * @param {string} endDate - The end date of the date range in ISO format.
     * @return {Promise<{ recipes: any[]; totalRecipe: number }>} An object containing the list of recipes and the total number of recipes.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('startDate')),
    __param(2, (0, type_graphql_1.Arg)('endDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "getQuedPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Adds a recipe from the planner to the grocery list for a specific member.
     *
     * @param {String} memberId - The ID of the member.
     * @param {String} recipeId - The ID of the recipe.
     * @return {Promise<string>} A string indicating the result of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "addToGroceryFromPlanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Merges or replaces the planner data for a specific date range and member.
     *
     * @param {string} startDate - The start date of the date range.
     * @param {String} endDate - The end date of the date range (nullable).
     * @param {String} memberId - The ID of the member.
     * @param {String} planId - The ID of the plan.
     * @param {MergeOrReplace} mergeOrReplace - The mode for merging or replacing the planner data.
     * @return {Promise<string>} A promise that resolves to 'done' when the operation is complete.
     */
    ,
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
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Fix the error ingredients in all recipe versions.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the fix is completed.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "fixV", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PlannerResolver.prototype, "n", null);
PlannerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlannerResolver);
exports.default = PlannerResolver;
