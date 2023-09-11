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
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const mapToBlend_1 = __importDefault(require("../../../models/mapToBlend"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const AddBlendIngredient_1 = __importDefault(require("./input-type/AddBlendIngredient"));
const IngredientFilter_1 = __importDefault(require("./input-type/IngredientFilter"));
const BlendIngredientInfo_1 = __importDefault(require("./input-type/BlendIngredientInfo"));
const EditBlendIngredient_1 = __importDefault(require("./input-type/EditBlendIngredient"));
const GetIngredientsFromNutrition_1 = __importDefault(require("../../wiki/resolver/input-type/GetIngredientsFromNutrition"));
const BlendIngredientData_1 = __importDefault(require("../schemas/BlendIngredientData"));
const ReturnBlendIngredient_1 = __importDefault(require("../schemas/ReturnBlendIngredient"));
const ReturnBlendIngredientBasedOnDefaultPortion_1 = __importDefault(require("../schemas/ReturnBlendIngredientBasedOnDefaultPortion"));
const IngredientForWiki_1 = __importDefault(require("../../wiki/schemas/IngredientForWiki"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const wiki_1 = __importDefault(require("../../../models/wiki"));
const GIGl_1 = __importDefault(require("../schemas/GIGl"));
const NutrientsWithGiGl_1 = __importDefault(require("../schemas/NutrientsWithGiGl"));
const axios_1 = __importDefault(require("axios"));
const ingredient_unit_converter_1 = require("@jclind/ingredient-unit-converter");
const CreateScrappedRecipe_1 = __importDefault(require("../../recipe/resolvers/input-type/CreateScrappedRecipe"));
const scrappedRecipe_1 = __importDefault(require("../../../models/scrappedRecipe"));
const NutrientListAndGiGlForScrapper_1 = __importDefault(require("../schemas/NutrientListAndGiGlForScrapper"));
const QANotFound_1 = __importDefault(require("../../../models/QANotFound"));
const BlendPortion_1 = __importDefault(require("../schemas/BlendPortion"));
const BlendPortionInput_1 = __importDefault(require("./input-type/BlendPortionInput"));
const addIngredientFromSrc_1 = __importDefault(require("./util/addIngredientFromSrc"));
const Compare_1 = __importDefault(require("../../../models/Compare"));
const temporaryCompareCollection_1 = __importDefault(require("../../../models/temporaryCompareCollection"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const CreateRecipe_1 = __importDefault(require("../../recipe/resolvers/input-type/CreateRecipe"));
const slugify_1 = __importDefault(require("slugify"));
const brand_1 = __importDefault(require("../../../models/brand"));
const Admin_1 = __importDefault(require("../../../models/Admin"));
const updateVersionFacts_1 = __importDefault(require("../../recipe/resolvers/util/updateVersionFacts"));
const getGlAndNetCarbs2_1 = __importDefault(require("./util/getGlAndNetCarbs2"));
const getBlendNutritionBasedOnRecipexxx_1 = __importDefault(require("./util/getBlendNutritionBasedOnRecipexxx"));
const getTopLevelChilds_1 = __importDefault(require("./util/getTopLevelChilds"));
const getSearchedBlendNutrition_1 = __importDefault(require("./util/getSearchedBlendNutrition"));
let BlendIngredientResolver = class BlendIngredientResolver {
    async getAllBlendIngredients() {
        let blendIngredients = await blendIngredient_1.default.find()
            .lean()
            .populate('varrient')
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished')
            .sort({ ingredientName: 1 });
        return blendIngredients;
    }
    /**
     * Retrieves all class one ingredients from the database.
     *
     * @return {Promise<Array<any>>} An array of class one ingredients.
     */
    async getAllClassOneIngredients() {
        let blendIngredients = await blendIngredient_1.default.find({
            classType: 'Class - 1',
        })
            .lean()
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished')
            .sort({ ingredientName: 1 });
        return blendIngredients;
    }
    //FIXME:
    async EditIngredient(data) {
        let food = await blendIngredient_1.default.findOne({ _id: data.editId });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        if (data.editableObject.varrient) {
            let wiki = await wiki_1.default.findOne({
                _id: data.editableObject.varrient,
            }).select('ingredientBookmarkList');
            if (wiki.ingredientBookmarkList) {
                await wiki_1.default.findOneAndUpdate({ _id: data.editableObject.varrient }, {
                    $pull: {
                        ingredientBookmarkList: { ingredientId: data.editId },
                    },
                });
            }
            await wiki_1.default.findOneAndUpdate({ _id: data.editableObject.varrient }, {
                $addToSet: { ingredientBookmarkList: { ingredientId: data.editId } },
            });
        }
        // if (data.editableObject.blendStatus === 'Archived') {
        //   await FoodSrcModel.findByIdAndUpdate(food.srcFoodReference, {
        //     addedToBlend: false,
        //   });
        //   return 'Archieved Successfully';
        // }
        if (data.editableObject.blendStatus) {
            // await BlendIngredientModel.findByIdAndRemove(data.editId);
            await ingredient_1.default.findByIdAndUpdate(food.srcFoodReference, {
                blendStatus: data.editableObject.blendStatus,
            });
        }
        if (data.editableObject.defaultPortion === '' ||
            data.editableObject.defaultPortion === null ||
            data.editableObject.defaultPortion === undefined) {
            // console.log('no default portion');
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        else {
            let newData = food;
            //@ts-ignore
            let newPortions = [];
            for (let i = 0; i < newData.portions.length; i++) {
                if (String(newData.portions[i]._id) ===
                    String(data.editableObject.defaultPortion)) {
                    // console.log('matched');
                    let changePortion = {
                        measurement: newData.portions[i].measurement,
                        measurement2: newData.portions[i].measurement2,
                        meausermentWeight: newData.portions[i].meausermentWeight,
                        default: true,
                        _id: newData.portions[i]._id,
                    };
                    newPortions.push(changePortion);
                }
                else {
                    let changePortion2 = {
                        measurement: newData.portions[i].measurement,
                        measurement2: newData.portions[i].measurement2,
                        meausermentWeight: newData.portions[i].meausermentWeight,
                        default: false,
                        _id: newData.portions[i]._id,
                    };
                    newPortions.push(changePortion2);
                }
            }
            newData.portions = newPortions;
            if (data.editableObject.varrient) {
                newData.isBookmarked = true;
                await wiki_1.default.findOneAndUpdate({ _id: data.editId }, { isBookmarked: true });
            }
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, newData);
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        return 'Successfully Edited';
    }
    async getBlendIngredientById(id) {
        let blendIngredient = await blendIngredient_1.default.findById(id)
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            populate: {
                path: 'category',
                model: 'BlendNutrientCategory',
            },
        })
            .populate('srcFoodReference')
            .populate({
            path: 'notBlendNutrients.uniqueNutrientRefference',
            model: 'UniqueNutrient',
        });
        return blendIngredient;
    }
    async getBlendIngredientPortionById(id) {
        let blendIngredient = await blendIngredient_1.default.findById(id).select('portions');
        return blendIngredient.portions;
    }
    async removeBlendIngredientFromSrc(id) {
        let blendIngredient = await blendIngredient_1.default.findOne({
            srcFoodReference: id,
        });
        if (!blendIngredient) {
            return new AppError_1.default('This Ingredient not found in Blend Database', 404);
        }
        await blendIngredient_1.default.findOneAndRemove({ _id: blendIngredient._id });
        await ingredient_1.default.findByIdAndUpdate(id, {
            addedToBlend: false,
        });
        return blendIngredient._id;
    }
    async removeABlendIngredient(id) {
        let food = await blendIngredient_1.default.findOne({ _id: id });
        if (!food) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        if (food.blendStatus === 'Active' || food.blendStatus === 'Review') {
            return new AppError_1.default('you can not remove Review or Active Ingredient', 404);
        }
        await ingredient_1.default.findByIdAndUpdate(food.srcFoodReference, {
            addedToBlend: false,
        });
        await blendIngredient_1.default.findOneAndRemove({ _id: id });
        return 'BlendIngredient removed';
    }
    /**
     * Adds a new BlendIngredient to the database.
     *
     * @param data - The data for the new BlendIngredient.
     * @returns A message indicating that the BlendIngredient has been added.
     */
    async addNewBlendIngredient(data) {
        await blendIngredient_1.default.create(data);
        return 'BlendIngredient added';
    }
    /**
     * Adds a new blend ingredient from a source by its ID.
     * This function is only accessible by admin users.
     *
     * @param srcId - The ID of the source ingredient.
     * @returns The data of the added ingredient.
     */
    async addNewBlendIngredientFromSrc(srcId) {
        let returnData = await (0, addIngredientFromSrc_1.default)(srcId);
        return returnData;
    }
    // {$or:[{region: "NA"},{sector:"Some Sector"}]}
    async filterIngredientByCategoryAndClass(data) {
        let ingredients;
        if (data.ingredientCategory === 'All') {
            if (+data.IngredientClass > 0) {
                ingredients = await blendIngredient_1.default.find({
                    classType: 'Class - ' + data.IngredientClass,
                    blendStatus: 'Active',
                })
                    .lean()
                    .populate({
                    path: 'blendNutrients.blendNutrientRefference',
                    model: 'BlendNutrient',
                })
                    .select('-notBlendNutrients -bodies -imageCount -nutrientCount -seoKeywords -wikiCoverImages -varrient -isPublished -seoCanonicalURL -seoMetaDescription -seoSiteMapPriority -seoSlug -seoTitle -wikiDescription -wikiFeatureImage -wikiTitle')
                    .sort({
                    ingredientName: 1,
                });
            }
            else {
                ingredients = await blendIngredient_1.default.find({
                    classType: {
                        $in: [
                            'Class - 1',
                            'Class - 2',
                            'Class - 3',
                            'Class - 4',
                            'Class - 5',
                        ],
                    },
                    blendStatus: 'Active',
                })
                    .lean()
                    .populate({
                    path: 'blendNutrients.blendNutrientRefference',
                    model: 'BlendNutrient',
                })
                    .select('-notBlendNutrients -bodies -imageCount -nutrientCount -seoKeywords -wikiCoverImages -varrient -isPublished -seoCanonicalURL -seoMetaDescription -seoSiteMapPriority -seoSlug -seoTitle -wikiDescription -wikiFeatureImage -wikiTitle')
                    .sort({
                    ingredientName: 1,
                });
            }
        }
        else {
            if (+data.IngredientClass > 0) {
                ingredients = await blendIngredient_1.default.find({
                    category: data.ingredientCategory,
                    classType: 'Class - ' + data.IngredientClass,
                    blendStatus: 'Active',
                })
                    .populate({
                    path: 'blendNutrients.blendNutrientRefference',
                    model: 'BlendNutrient',
                })
                    .select('-notBlendNutrients -bodies -imageCount -nutrientCount -seoKeywords -wikiCoverImages -varrient -isPublished -seoCanonicalURL -seoMetaDescription -seoSiteMapPriority -seoSlug -seoTitle -wikiDescription -wikiFeatureImage -wikiTitle');
            }
            else {
                ingredients = await blendIngredient_1.default.find({
                    category: data.ingredientCategory,
                    classType: {
                        $in: [
                            'Class - 1',
                            'Class - 2',
                            'Class - 3',
                            'Class - 4',
                            'Class - 5',
                        ],
                    },
                    blendStatus: 'Active',
                })
                    .populate({
                    path: 'blendNutrients.blendNutrientRefference',
                    model: 'BlendNutrient',
                })
                    .select('-notBlendNutrients -bodies -imageCount -nutrientCount -seoKeywords -wikiCoverImages -varrient -isPublished -seoCanonicalURL -seoMetaDescription -seoSiteMapPriority -seoSlug -seoTitle -wikiDescription -wikiFeatureImage -wikiTitle')
                    .sort({
                    ingredientName: 1,
                });
            }
        }
        return ingredients;
    }
    // blendNutrients: [
    //   {
    //     value: String,
    //     blendNutrientRefference: {
    //       type: Schema.Types.ObjectId,
    //       ref: 'BlendNutrient',
    //     },
    //   },
    // ],
    //FIXME:
    /**
     * Retrieves blend ingredient information based on the default portion.
     *
     * @param {string} ingredientId - The ID of the ingredient
     * @return {Promise<any>} - The retrieved blend ingredient information
     */
    async getBlendIngredientInfoBasedOnDefaultPortion(ingredientId) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        }).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let defaultPortion;
        let found = false;
        for (let i = 0; i < ingredient.portions.length; i++) {
            if (ingredient.portions[i].default) {
                defaultPortion = ingredient.portions[i].meausermentWeight;
                found = true;
            }
        }
        if (!found) {
            defaultPortion = ingredient.portions[0].meausermentWeight;
        }
        let defaultPortionNutrients = [];
        // checked above
        for (let i = 0; i < ingredient.blendNutrients.length; i++) {
            let nutrient = {
                //@ts-ignore
                value: (Number(ingredient.blendNutrients[i].value) / 100) *
                    Number(defaultPortion),
                blendNutrientRefference: ingredient.blendNutrients[i].blendNutrientRefference,
            };
            defaultPortionNutrients.push(nutrient);
        }
        let returnIngredientBasedOnDefaultPortion = ingredient;
        returnIngredientBasedOnDefaultPortion.defaultPortionNutrients =
            defaultPortionNutrients;
        return returnIngredientBasedOnDefaultPortion;
    }
    async searchBlendIngredients(searchTerm) {
        let ingredients = await blendIngredient_1.default.find({
            ingredientName: { $regex: searchTerm, $options: 'i' },
        }).populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
        });
        return ingredients;
    }
    async getBlendNutritionBasedOnRecipeData(recipeId, isVersion) {
        let recipe;
        let model;
        if (isVersion) {
            model = RecipeVersionModel_1.default;
        }
        else {
            model = recipeModel_1.default;
        }
        recipe = await model.findOne({ _id: recipeId }).select('-_id ingredients');
        //@ts-ignore
        let data = recipe.ingredients.map((x) => {
            return {
                ingredientId: String(x.ingredientId),
                value: x.weightInGram,
            };
        });
        let searchedIngredients = data.map(
        // @ts-ignore
        (x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $in: searchedIngredients },
            status: 'Active',
        })
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            select: '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
        })
            .lean();
        for (let i = 0; i < ingredients.length; i++) {
            let value = data.filter(
            // @ts-ignore
            (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                ingredients[i].blendNutrients[j].value =
                    (+ingredients[i].blendNutrients[j].value / 100) * value;
            }
        }
        let nutrients = [];
        for (let i = 0; i < ingredients.length; i++) {
            let temp = ingredients[i];
            temp.blendNutrients = temp.blendNutrients.filter(
            // @ts-ignore
            (bn) => bn.value !== 0 && +bn.blendNutrientRefference.min_measure < +bn.value);
            nutrients.push(...temp.blendNutrients);
        }
        //@ts-ignore
        let returnNutrients = nutrients.reduce((acc, nutrient) => {
            //@ts-ignore
            let obj = acc.find(
            //@ts-ignore
            (o) => String(o.blendNutrientRefference._id) ===
                String(nutrient.blendNutrientRefference._id));
            if (!obj) {
                nutrient.count = 1;
                acc.push(nutrient);
            }
            else {
                //@ts-ignore
                const index = acc.findIndex((element, index) => {
                    if (String(element.blendNutrientRefference._id) ===
                        String(obj.blendNutrientRefference._id)) {
                        return true;
                    }
                });
                acc[index].count++;
                acc[index].value = +acc[index].value + +nutrient.value;
            }
            return acc;
        }, []);
        let blendNutrientCategories = await blendNutrientCategory_1.default.find()
            .lean()
            .select('_id categoryName');
        //returnNutrients
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] = await (0, getTopLevelChilds_1.default)(blendNutrientCategories[i]._id, returnNutrients);
        }
        return JSON.stringify(obj);
    }
    async getNutrientsListAndGiGlByRecipe(recipeId, versionId) {
        let ingredientsInfo;
        if (versionId) {
            let version = await RecipeVersionModel_1.default.findOne({ _id: versionId }).select('ingredients');
            ingredientsInfo = version.ingredients.map((x) => {
                return {
                    ingredientId: String(x.ingredientId),
                    value: x.weightInGram,
                };
            });
        }
        else {
            let recipe = await recipeModel_1.default.findOne({ _id: recipeId }).select('defaultVersion');
            let version = await RecipeVersionModel_1.default.findOne({
                _id: recipe.defaultVersion,
            }).select('ingredients');
            ingredientsInfo = version.ingredients.map((x) => {
                return {
                    ingredientId: String(x.ingredientId),
                    value: x.weightInGram,
                };
            });
        }
        let nutrientList = await (0, getBlendNutritionBasedOnRecipexxx_1.default)(ingredientsInfo);
        // console.log(nutrientList);
        let giGl = await (0, getGlAndNetCarbs2_1.default)(ingredientsInfo);
        return {
            nutrients: nutrientList,
            giGl: giGl,
        };
    }
    /**
     *
     * @param [ingredientsInfo]
     * @returns String
     */
    async saveScrappedRecipe(data) {
        await scrappedRecipe_1.default.create();
        return 'done';
    }
    async manipulatePortionsToBlendIngredient(blendPortions, BlendIngredientId) {
        let measurements = blendPortions.map((blendPortion) => blendPortion.measurement);
        if (new Set(measurements).size !== measurements.length) {
            return new AppError_1.default('portions contains duplicate value', 403);
        }
        let blendIngredient = await blendIngredient_1.default.findOneAndUpdate({
            _id: BlendIngredientId,
        }, {
            portions: blendPortions,
        }, {
            new: true,
        });
        return 'success';
    }
    async checkParsing(recipeIngredients) {
        let ingredientsShape = {
            recipeIngredients: recipeIngredients,
        };
        var dataX = JSON.stringify(ingredientsShape);
        var config = {
            method: 'get',
            url: 'http://54.91.110.31/parse-ingredients',
            headers: {
                'Content-Type': 'application/json',
            },
            data: dataX,
        };
        let res = await (0, axios_1.default)(config);
        // console.log('data', res.data);
        // console.log('best', res.data.parsed_data[0].best_match);
        return 'done';
    }
    async tempEditRecipeByAdmin(data) {
        let admin = await Admin_1.default.findOne({ _id: data.adminId });
        if (!admin) {
            return new AppError_1.default('admin not found', 404);
        }
        if (!data.url) {
            return new AppError_1.default('url not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({
            url: data.url,
        });
        if (recipe) {
            // if (recipe.adminId) {
            //   return new AppError('recipe already saved', 404);
            // }
            await recipeModel_1.default.findOneAndUpdate({
                _id: recipe._id,
            }, {
                adminId: admin._id,
                tempAdmin: true,
            });
            await RecipeVersionModel_1.default.findOneAndUpdate({
                _id: recipe.originalVersion,
            }, {
                adminId: admin._id,
                createdByAdmin: true,
            });
            if (data.recipeIngredients.length > 0) {
                let parsingData = await this.searchInScrappedRecipeFromUser(data.recipeIngredients, null, null, null);
                //@ts-ignore
                data.ingredients = parsingData.blendIngredients;
                //@ts-ignore
                data.errorIngredients = parsingData.errorIngredients;
                let newData = data;
                newData.foodCategories = [];
                if (newData.ingredients) {
                    for (let i = 0; i < newData.ingredients.length; i++) {
                        newData.ingredients[i].portions = [];
                        let ingredient = await blendIngredient_1.default.findOne({
                            _id: newData.ingredients[i].ingredientId,
                        });
                        let index = 0;
                        let selectedPortionIndex = 0;
                        for (let j = 0; j < ingredient.portions.length; j++) {
                            if (ingredient.portions[j].default === true) {
                                index = j;
                                console.log(index);
                                break;
                            }
                        }
                        for (let k = 0; k < ingredient.portions.length; k++) {
                            if (ingredient.portions[k].measurement ===
                                newData.ingredients[i].selectedPortionName) {
                                selectedPortionIndex = k;
                            }
                            let portion = {
                                name: ingredient.portions[k].measurement,
                                quantity: newData.ingredients[i].weightInGram /
                                    +ingredient.portions[k].meausermentWeight,
                                default: ingredient.portions[k].default,
                                gram: ingredient.portions[k].meausermentWeight,
                            };
                            newData.ingredients[i].portions.push(portion);
                        }
                        newData.ingredients[i].selectedPortion = {
                            name: ingredient.portions[selectedPortionIndex].measurement,
                            quantity: newData.ingredients[i].weightInGram /
                                +ingredient.portions[selectedPortionIndex].meausermentWeight,
                            gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
                        };
                    }
                }
                else {
                    newData.ingredients = [];
                }
                console.log('x', newData.ingredients);
                await RecipeVersionModel_1.default.findOneAndUpdate({ _id: recipe.originalVersion }, {
                    ingredients: newData.ingredients,
                });
            }
            return 'done';
        }
        if (data.recipeIngredients.length > 0) {
            let parsingData = await this.searchInScrappedRecipeFromUser(data.recipeIngredients, null, null, null);
            //@ts-ignore
            data.ingredients = parsingData.blendIngredients;
            //@ts-ignore
            data.errorIngredients = parsingData.errorIngredients;
        }
        let newData = data;
        newData.foodCategories = [];
        if (newData.ingredients) {
            for (let i = 0; i < newData.ingredients.length; i++) {
                newData.ingredients[i].portions = [];
                let ingredient = await blendIngredient_1.default.findOne({
                    _id: newData.ingredients[i].ingredientId,
                });
                let index = 0;
                let selectedPortionIndex = 0;
                for (let j = 0; j < ingredient.portions.length; j++) {
                    if (ingredient.portions[j].default === true) {
                        index = j;
                        console.log(index);
                        break;
                    }
                }
                for (let k = 0; k < ingredient.portions.length; k++) {
                    if (ingredient.portions[k].measurement ===
                        newData.ingredients[i].selectedPortionName) {
                        selectedPortionIndex = k;
                    }
                    let portion = {
                        name: ingredient.portions[k].measurement,
                        quantity: newData.ingredients[i].weightInGram /
                            +ingredient.portions[k].meausermentWeight,
                        default: ingredient.portions[k].default,
                        gram: ingredient.portions[k].meausermentWeight,
                    };
                    newData.ingredients[i].portions.push(portion);
                }
                newData.ingredients[i].selectedPortion = {
                    name: ingredient.portions[selectedPortionIndex].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[selectedPortionIndex].meausermentWeight,
                    gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
                };
                newData.foodCategories.push(ingredient.category);
            }
        }
        else {
            newData.ingredients = [];
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        newData.adminId = admin._id;
        if (newData.url) {
            const { hostname } = new URL(newData.url);
            let brandName = '';
            brandName = hostname.replace('www.', '');
            brandName = brandName.replace('.com', '');
            let brand = await brand_1.default.findOne({
                brandName: brandName,
            });
            if (brand) {
                newData.brand = brand._id;
            }
            else {
                let brandInfo = {
                    brandUrl: hostname,
                    slug: (0, slugify_1.default)(brandName),
                    brandName: brandName,
                    brandIcon: data.favicon,
                    brandImage: data.favicon,
                    canonicalURL: data.seoCanonicalURL,
                };
                let newBrand = await brand_1.default.create(brandInfo);
                newData.brand = newBrand._id;
            }
        }
        newData.tempAdmin = true;
        let userRecipe = await recipeModel_1.default.create(newData);
        let recipeVersion = await RecipeVersionModel_1.default.create({
            recipeId: userRecipe._id,
            postfixTitle: data.name,
            selectedImage: data.image[0].image,
            servingSize: newData.servingSize,
            description: newData.description,
            ingredients: newData.ingredients,
            recipeInstructions: newData.recipeInstructions,
            createdByAdmin: true,
            adminId: admin._id,
            errorIngredients: data.errorIngredients,
            isDefault: true,
            isOriginal: true,
        });
        //@ts-ignore
        await (0, updateVersionFacts_1.default)(recipeVersion._id);
        if (data.errorIngredients) {
            if (data.errorIngredients.length > 0) {
                for (let i = 0; i < data.errorIngredients.length; i++) {
                    await QANotFound_1.default.findOneAndUpdate({
                        _id: data.errorIngredients[i].qaId,
                    }, {
                        $push: { versions: recipeVersion._id },
                    });
                }
            }
        }
        await recipeModel_1.default.findOneAndUpdate({
            _id: userRecipe._id,
        }, {
            $push: { recipeVersion: recipeVersion._id },
            originalVersion: recipeVersion._id,
            defaultVersion: recipeVersion._id,
        });
        return 'added!';
    }
    async removeAllAddedByAdminRecipe() {
        await recipeModel_1.default.findOneAndRemove({
            adminId: {
                $ne: null,
            },
        });
        return 'done';
    }
    async addRecipeFromAdmin(data) {
        let admin = await Admin_1.default.findOne({ _id: data.adminId });
        if (!admin) {
            return new AppError_1.default('admin not found', 404);
        }
        if (!data.url) {
            return new AppError_1.default('url not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({
            url: data.url,
        });
        if (recipe) {
            if (recipe.adminId) {
                return new AppError_1.default('recipe already saved', 404);
            }
            await recipeModel_1.default.findOneAndUpdate({
                _id: recipe._id,
            }, {
                adminId: admin._id,
                tempAdmin: true,
            });
            await RecipeVersionModel_1.default.findOneAndUpdate({
                _id: recipe.originalVersion,
            }, {
                adminId: admin._id,
                createdByAdmin: true,
            });
            return 'done';
        }
        if (data.recipeIngredients.length > 0) {
            let parsingData = await this.searchInScrappedRecipeFromUser(data.recipeIngredients, null, null, null);
            //@ts-ignore
            data.ingredients = parsingData.blendIngredients;
            //@ts-ignore
            data.errorIngredients = parsingData.errorIngredients;
        }
        let newData = data;
        newData.foodCategories = [];
        if (newData.ingredients) {
            for (let i = 0; i < newData.ingredients.length; i++) {
                newData.ingredients[i].portions = [];
                let ingredient = await blendIngredient_1.default.findOne({
                    _id: newData.ingredients[i].ingredientId,
                });
                let index = 0;
                let selectedPortionIndex = 0;
                for (let j = 0; j < ingredient.portions.length; j++) {
                    if (ingredient.portions[j].default === true) {
                        index = j;
                        console.log(index);
                        break;
                    }
                }
                for (let k = 0; k < ingredient.portions.length; k++) {
                    if (ingredient.portions[k].measurement ===
                        newData.ingredients[i].selectedPortionName) {
                        selectedPortionIndex = k;
                    }
                    let portion = {
                        name: ingredient.portions[k].measurement,
                        quantity: newData.ingredients[i].weightInGram /
                            +ingredient.portions[k].meausermentWeight,
                        default: ingredient.portions[k].default,
                        gram: ingredient.portions[k].meausermentWeight,
                    };
                    newData.ingredients[i].portions.push(portion);
                }
                newData.ingredients[i].selectedPortion = {
                    name: ingredient.portions[selectedPortionIndex].measurement,
                    quantity: newData.ingredients[i].weightInGram /
                        +ingredient.portions[selectedPortionIndex].meausermentWeight,
                    gram: ingredient.portions[selectedPortionIndex].meausermentWeight,
                };
                newData.foodCategories.push(ingredient.category);
            }
        }
        else {
            newData.ingredients = [];
        }
        newData.foodCategories = [...new Set(newData.foodCategories)];
        newData.global = false;
        newData.adminId = admin._id;
        if (newData.url) {
            const { hostname } = new URL(newData.url);
            let brandName = '';
            brandName = hostname.replace('www.', '');
            brandName = brandName.replace('.com', '');
            let brand = await brand_1.default.findOne({
                brandName: brandName,
            });
            if (brand) {
                newData.brand = brand._id;
            }
            else {
                let brandInfo = {
                    brandUrl: hostname,
                    slug: (0, slugify_1.default)(brandName),
                    brandName: brandName,
                    brandIcon: data.favicon,
                    brandImage: data.favicon,
                    canonicalURL: data.seoCanonicalURL,
                };
                let newBrand = await brand_1.default.create(brandInfo);
                newData.brand = newBrand._id;
            }
        }
        newData.tempAdmin = true;
        let userRecipe = await recipeModel_1.default.create(newData);
        let recipeVersion = await RecipeVersionModel_1.default.create({
            recipeId: userRecipe._id,
            postfixTitle: data.name,
            selectedImage: data.image[0].image,
            servingSize: newData.servingSize,
            description: newData.description,
            ingredients: newData.ingredients,
            recipeInstructions: newData.recipeInstructions,
            createdByAdmin: true,
            adminId: admin._id,
            errorIngredients: data.errorIngredients,
            isDefault: true,
            isOriginal: true,
        });
        //@ts-ignore
        await (0, updateVersionFacts_1.default)(recipeVersion._id);
        if (data.errorIngredients) {
            if (data.errorIngredients.length > 0) {
                for (let i = 0; i < data.errorIngredients.length; i++) {
                    await QANotFound_1.default.findOneAndUpdate({
                        _id: data.errorIngredients[i].qaId,
                    }, {
                        $push: { versions: recipeVersion._id },
                    });
                }
            }
        }
        await recipeModel_1.default.findOneAndUpdate({
            _id: userRecipe._id,
        }, {
            $push: { recipeVersion: recipeVersion._id },
            originalVersion: recipeVersion._id,
            defaultVersion: recipeVersion._id,
        });
        return 'added!';
    }
    // @Mutation((type) => String)
    // async removeAllAddedByAdminRecipe() {
    //   await RecipeModel.findOneAndRemove({
    //     adminId: {
    //       $ne: null,
    //     },
    //   });
    //   return 'done';
    // }
    async searchInScrappedRecipeFromUser(recipeIngredients, url, userId, isClient) {
        let ingredientsShape = {
            recipeIngredients: recipeIngredients,
        };
        var dataX = JSON.stringify(ingredientsShape);
        var config = {
            method: 'get',
            url: 'http://54.91.110.31/parse-ingredients',
            headers: {
                'Content-Type': 'application/json',
            },
            data: dataX,
        };
        let res = await (0, axios_1.default)(config);
        let blends = [];
        let notBlends = [];
        let portionsProblem = [];
        let notFountIndexes = [];
        // console.log(res.data);
        let errorParsedKeys = Object.keys(res.data.error_parsed);
        for (let i = 0; i < errorParsedKeys.length; i++) {
            let qaId = '';
            let found = await QANotFound_1.default.findOne({
                name: res.data.error_parsed[errorParsedKeys[i]],
            }).select('_id');
            if (found) {
                qaId = found._id;
            }
            else {
                let errorParsedQA = await QANotFound_1.default.create({
                    name: res.data.error_parsed[errorParsedKeys[i]],
                    quantity: 0,
                    unit: '',
                    comment: '',
                    userIngredient: res.data.error_parsed[errorParsedKeys[i]],
                    status: 'Archived',
                    issues: ['PE'],
                    errorParsed: true,
                });
                qaId = errorParsedQA._id;
            }
            notBlends.push({
                qaId: qaId,
                errorString: res.data.error_parsed[errorParsedKeys[i]],
            });
            notFountIndexes.push(+errorParsedKeys[i]);
        }
        console.log(res.data.parsed_data);
        for (let i = 0; i < res.data.parsed_data.length; i++) {
            let blendIngredient = null;
            //res.data[0].parsed_data[i].best_match.length
            for (let j = 0; j < res.data.parsed_data[i].best_match.length; j++) {
                blendIngredient = await blendIngredient_1.default.findOne({
                    srcFoodReference: res.data.parsed_data[i].best_match[j].db_ingredient_id,
                    $or: [
                        {
                            blendStatus: 'Active',
                        },
                        {
                            blendStatus: 'Review',
                        },
                    ],
                }).select('-blendNutrients -notBlendNutrients -bodies');
                if (blendIngredient) {
                    break;
                }
            }
            if (!blendIngredient) {
                let notFound = {
                    name: res.data.parsed_data[i].INGREDIENT,
                    quantity: res.data.parsed_data[i].QUANTITY,
                    unit: res.data.parsed_data[i].QUANTITY_UNIT,
                    comment: res.data.parsed_data[i].COMMENT,
                    userIngredient: res.data.parsed_data[i].original_ingredient,
                    issues: ['NF'],
                    status: 'Review',
                    sourceIngredients: res.data.parsed_data[i].best_match.map((bestM, index) => {
                        return {
                            ingredientId: bestM.db_ingredient_id,
                            percentage: 100 - index,
                        };
                    }),
                };
                let qaId = '';
                let found = await QANotFound_1.default.findOne({
                    name: res.data.parsed_data[i].INGREDIENT,
                }).select('_id');
                if (found) {
                    qaId = found._id;
                }
                else {
                    let newQA = await QANotFound_1.default.create(notFound);
                    qaId = newQA._id;
                }
                notBlends.push({
                    name: res.data.parsed_data[i].INGREDIENT,
                    quantity: res.data.parsed_data[i].QUANTITY,
                    unit: res.data.parsed_data[i].QUANTITY_UNIT,
                    comment: res.data.parsed_data[i].COMMENT,
                    index: res.data.parsed_data[i].index,
                    userIngredient: res.data.parsed_data[i].original_ingredient,
                    issues: ['NF'],
                    status: 'Review',
                    qaId: qaId,
                    errorString: res.data.parsed_data[i].original_ingredient,
                });
                notFountIndexes.push(res.data.parsed_data[i].index);
            }
            else {
                blends.push({
                    ingredientId: blendIngredient._id,
                    quantity: res.data.parsed_data[i].QUANTITY,
                    unit: res.data.parsed_data[i].QUANTITY_UNIT,
                    name: res.data.parsed_data[i].INGREDIENT,
                    originalIngredientName: res.data.parsed_data[i].INGREDIENT,
                    quantityString: res.data.parsed_data[i].QUANTITY_STRING,
                    db_name: blendIngredient.ingredientName,
                    comment: res.data.parsed_data[i].COMMENT,
                    portions: blendIngredient.portions,
                    userIngredient: res.data.parsed_data[i].original_ingredient,
                    index: res.data.parsed_data[i].index,
                    percentage: 100,
                });
            }
        }
        // console.log('blends', blends);
        const parseFraction = (fraction) => {
            if (fraction === '') {
                return 0;
            }
            const [numerator, denominator] = fraction.split('/').map(Number);
            return numerator / denominator;
        };
        for (let i = 0; i < blends.length; i++) {
            if (!blends[i].unit) {
                blends[i].qa = true;
                continue;
            }
            for (let j = 0; j < blends[i].portions.length; j++) {
                if (blends[i].unit === blends[i].portions[j].measurement) {
                    blends[i].value =
                        blends[i].quantity * blends[i].portions[j].meausermentWeight;
                    // blends[i].unit = 'g';
                    if (!blends[i].value) {
                        blends[i].value = 0 * blends[i].portions[j].meausermentWeight;
                        blends[i].quantity = 0;
                    }
                    blends[i].weightInGram = blends[i].value;
                    blends[i].selectedPortionName = blends[i].unit;
                    // console.log("ccc", blends);
                }
            }
            // console.log('x', blends[i].value);
            if (!blends[i].value) {
                // console.log('helloooo');
                if (!+blends[i].quantity) {
                    blends[i].quantity = 0;
                    let converted = (0, ingredient_unit_converter_1.converter)(0, blends[i].unit, blends[i].portions[0].measurement);
                    console.log('', converted);
                    if (converted.error) {
                        console.log('a');
                        let qaId = '';
                        let obj = {
                            name: blends[i].name,
                            unit: blends[i].unit,
                            quantity: 0,
                            comment: blends[i].comment,
                            userIngredient: blends[i].userIngredient,
                            issues: ['Quantity'],
                            status: 'Review',
                            bestMatch: blends[i].ingredientId,
                        };
                        let newQA = await QANotFound_1.default.create(obj);
                        qaId = newQA._id;
                        blends[i].qaId = qaId;
                        blends[i].issues = ['Quantity'];
                        blends[i].status = 'Review';
                        blends[i].errorString = blends[i].userIngredient;
                        notFountIndexes.push(blends[i].index);
                        continue;
                    }
                    blends[i].value =
                        converted.quantity * blends[i].portions[0].meausermentWeight;
                }
                else {
                    let converted = (0, ingredient_unit_converter_1.converter)(blends[i].quantity, blends[i].unit, blends[i].portions[0].measurement);
                    if (converted.error) {
                        // console.log('a');
                        let qaId = '';
                        let found = await QANotFound_1.default.findOne({
                            name: blends[i].name,
                            unit: blends[i].unit,
                        }).select('_id');
                        // console.log('founnnnnnndddnndnnd', found);
                        if (found) {
                            qaId = found._id;
                        }
                        else {
                            let obj = {
                                name: blends[i].name,
                                unit: blends[i].unit,
                                quantity: blends[i].quantity,
                                comment: blends[i].comment,
                                userIngredient: blends[i].userIngredient,
                                issues: ['Unit'],
                                status: 'Review',
                                bestMatch: blends[i].ingredientId,
                            };
                            let newQA = await QANotFound_1.default.create(obj);
                            qaId = newQA._id;
                        }
                        blends[i].qaId = qaId;
                        blends[i].issues = ['Unit'];
                        blends[i].status = 'Review';
                        blends[i].errorString = blends[i].userIngredient;
                        notFountIndexes.push(blends[i].index);
                        continue;
                    }
                    blends[i].value =
                        converted.quantity * blends[i].portions[0].meausermentWeight;
                    blends[i].weightInGram = blends[i].value;
                    await blendIngredient_1.default.findOneAndUpdate({
                        _id: blends[i].ingredientId,
                    }, {
                        $push: {
                            portions: {
                                measurement: blends[i].unit,
                                measurement2: 'undeterminded',
                                meausermentWeight: blends[i].value / blends[i].quantity,
                            },
                        },
                    });
                }
            }
        }
        let formateBlends = blends
            .filter((blend) => blend.value)
            .map((blend) => {
            return {
                ingredientId: String(blend.ingredientId),
                value: blend.value,
            };
        });
        let processed = blends.filter((blend) => !blend.qaId);
        let notProcessed = blends.filter((blend) => blend.qaId);
        // console.log('processed', processed);
        if (isClient) {
            for (let i = 0; i < processed.length; i++) {
                let ingredient = await blendIngredient_1.default.findOne({
                    _id: processed[i].ingredientId,
                }).select('featuredImage');
                processed[i].featuredImage = ingredient.featuredImage
                    ? ingredient.featuredImage
                    : '';
            }
        }
        // console.log(processed);
        for (let i = 0; i < notProcessed.length; i++) {
            notBlends.push(notProcessed[i]);
        }
        let myData = await this.getNutrientsListAndGiGlByIngredientsForScrappingPanel(formateBlends);
        let alreadyInCompare = false;
        let collections = [];
        let recipeId = '';
        if (url && userId) {
            let recipe = await recipeModel_1.default.findOne({
                url: url,
            }).select('_id');
            if (recipe) {
                let recipeCompare = await Compare_1.default.findOne({
                    recipeId: recipe._id,
                    userId: userId,
                });
                if (recipeCompare) {
                    alreadyInCompare = true;
                }
                else {
                    let tempCompare = await temporaryCompareCollection_1.default.findOne({
                        recipeId: recipe._id,
                        userId: userId,
                    });
                    if (tempCompare) {
                        alreadyInCompare = true;
                    }
                }
                let userRecipe = await UserRecipeProfile_1.default.findOne({
                    recipeId: recipe._id,
                    userId: userId,
                });
                if (userRecipe) {
                    collections = await userCollection_1.default.find({
                        userId,
                        recipes: {
                            $in: [recipe._id],
                        },
                    });
                    collections = collections.map((collection) => String(collection._id));
                    console.log(recipe._id);
                    recipeId = recipe._id;
                }
            }
        }
        return {
            ...myData,
            notFoundIndexes: notFountIndexes.sort((a, b) => a - b),
            blendIngredients: processed,
            errorIngredients: notBlends,
            isAlreadyInCompared: alreadyInCompare,
            collections: collections,
            recipeId: recipeId,
        };
    }
    /**
     * Retrieves the list of nutrients and GI/GL values based on the given ingredients information.
     *
     * @param {BlendIngredientInfo[]} ingredientsInfo - An array of BlendIngredientInfo objects representing the ingredients information.
     * @return {Promise<{ nutrients: any[]; giGl: any[]; }>} A Promise that resolves to an object containing the list of nutrients and GI/GL values.
     */
    async getNutrientsListAndGiGlByIngredients(ingredientsInfo) {
        let nutrientList = await (0, getBlendNutritionBasedOnRecipexxx_1.default)(ingredientsInfo);
        let giGl = await (0, getGlAndNetCarbs2_1.default)(ingredientsInfo);
        return {
            nutrients: nutrientList,
            giGl: giGl,
        };
    }
    /**
     * Retrieves the list of nutrients and GI/GL values for a given list of ingredients
     * to be used for the scrapping panel.
     *
     * @param {BlendIngredientInfo[]} ingredientsInfo - The information about the blend ingredients.
     * @return {Promise<{nutrients: type, giGl: type}>} - The list of nutrients and GI/GL values.
     */
    async getNutrientsListAndGiGlByIngredientsForScrappingPanel(ingredientsInfo) {
        let mySearch = [
            '620b4606b82695d67f28e193',
            '620b4607b82695d67f28e196',
            '620b4607b82695d67f28e199',
            '620b4608b82695d67f28e19c',
        ];
        let nutrientList = await this.getBlendNutritionForScrappingPanel(ingredientsInfo, mySearch);
        let giGl = await (0, getGlAndNetCarbs2_1.default)(ingredientsInfo);
        return {
            nutrients: nutrientList,
            giGl: giGl,
        };
    }
    async getBlendNutritionForScrappingPanel(ingredientsInfo, mySearch) {
        return await (0, getSearchedBlendNutrition_1.default)(ingredientsInfo, mySearch);
    }
    /**
     * Retrieves all ingredients data based on nutrition.
     *
     * @param {GetIngredientsFromNutrition} data - The data containing the nutrition ID and category.
     * @return {any} An array of ingredients sorted by their value in descending order.
     */
    async getAllIngredientsDataBasedOnNutrition(data) {
        let nutrient = await blendNutrient_1.default.findOne({
            _id: data.nutritionID,
        }).populate('category');
        if (!nutrient) {
            return new AppError_1.default('Nutrient not found', 404);
        }
        let ingredients;
        if (data.category === 'All') {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
            })
                .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                .populate('blendNutrients.blendNutrientRefference');
        }
        else {
            ingredients = await blendIngredient_1.default.find({
                classType: 'Class - 1',
                blendStatus: 'Active',
                category: data.category,
            })
                .select('-srcFoodReference -description -classType -blendStatus -category -sourceName -notBlendNutrients')
                .populate('blendNutrients.blendNutrientRefference');
        }
        let returnIngredients = {};
        for (let i = 0; i < ingredients.length; i++) {
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                if (String(ingredients[i].blendNutrients[j].blendNutrientRefference._id) === data.nutritionID) {
                    if (!returnIngredients[ingredients[i].ingredientName]) {
                        // let value = await this.convertToGram({
                        //   amount: parseInt(ingredients[i].blendNutrients[j].value),
                        //   unit: ingredients[i].blendNutrients[j].blendNutrientRefference
                        //     .units,
                        // });
                        let defaultPortion = ingredients[i].portions.filter(
                        //@ts-ignore
                        (a) => a.default === true)[0];
                        if (!defaultPortion) {
                            defaultPortion = ingredients[i].portions[0];
                        }
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseFloat(ingredients[i].blendNutrients[j].value),
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
                            portion: defaultPortion,
                        };
                    }
                    else {
                        let defaultPortion = ingredients[i].portions.filter(
                        //@ts-ignore
                        (a) => a.default === true)[0];
                        if (!defaultPortion) {
                            defaultPortion = ingredients[i].portions[0];
                        }
                        returnIngredients[ingredients[i].ingredientName] = {
                            ingredientId: ingredients[i]._id,
                            name: ingredients[i].ingredientName,
                            value: parseFloat(returnIngredients[ingredients[i].ingredientName].value) + parseFloat(ingredients[i].blendNutrients[j].value),
                            units: ingredients[i].blendNutrients[j].blendNutrientRefference.units,
                            portion: defaultPortion,
                        };
                    }
                }
            }
        }
        let sortArray = [];
        Object.keys(returnIngredients).forEach((key) => {
            sortArray.push(returnIngredients[key]);
        });
        //@ts-ignore
        let result = sortArray.sort((a, b) => {
            return b.value - a.value;
        });
        return result;
    }
    /**
     * Asynchronously changes the blend nutrients.
     *
     * @return {Promise<string>} The result of the function.
     */
    async changeBlendNutrients() {
        let blendIngredients = await blendIngredient_1.default.find();
        for (let i = 1; i < blendIngredients.length; i++) {
            let values = [];
            for (let j = 0; j < blendIngredients[i].blendNutrients.length; j++) {
                let blendNutrient = await blendNutrient_1.default.findOne({
                    _id: blendIngredients[i].blendNutrients[j].blendNutrientRefference,
                });
                // console.log(blendNutrient.nutrientName);
                if (blendNutrient) {
                    values.push({
                        value: blendIngredients[i].blendNutrients[j].value,
                        blendNutrientRefference: blendNutrient._id,
                        uniqueNutrientReferrence: blendNutrient.uniqueNutrientId,
                        //@ts-ignore
                        _id: blendIngredients[i].blendNutrients[j]._id,
                    });
                }
                else {
                    // console.log(
                    //   blendIngredients[i].blendNutrients[j].blendNutrientRefference
                    // );
                }
            }
            await blendIngredient_1.default.findOneAndUpdate({ _id: blendIngredients[i]._id }, { blendNutrients: values });
        }
        return 'done';
    }
    /**
     * Change the blend nutrients.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the blend nutrients are successfully changed.
     */
    async changeBlendNutrients23() {
        let blendNutrients = await blendNutrient_1.default.find({});
        for (let i = 0; i < blendNutrients.length; i++) {
            if (!blendNutrients[i].uniqueNutrientId) {
                let mapTOBlend = await mapToBlend_1.default.findOne({
                    blendNutrientId: blendNutrients[i]._id,
                });
                if (mapTOBlend) {
                    await blendNutrient_1.default.findOneAndUpdate({ _id: blendNutrients[i]._id }, {
                        uniqueNutrientId: mapTOBlend.srcUniqueNutrientId,
                    });
                }
            }
        }
        return 'done';
    }
    /**
     * Asynchronously changes the water value.
     *
     * @return {string} The string 'done' indicating the function has finished.
     */
    async changeWaterValue() {
        let blendIngredients = await blendIngredient_1.default.find({});
        for (let i = 1; i < blendIngredients.length; i++) {
            let values = [];
            for (let j = 0; j < blendIngredients[i].blendNutrients.length; j++) {
                if (String(blendIngredients[i].blendNutrients[j].blendNutrientRefference) === '62407412305947996ac265eb') {
                    values.push({
                        value2: blendIngredients[i].blendNutrients[j].value,
                        value: (+blendIngredients[i].blendNutrients[j].value * 0.035274).toString(),
                        blendNutrientRefference: blendIngredients[i].blendNutrients[j].blendNutrientRefference,
                        //@ts-ignore
                        uniqueNutrientReferrence: blendIngredients[i].blendNutrients[j].uniqueNutrientReferrence,
                        //@ts-ignore
                        _id: blendIngredients[i].blendNutrients[j]._id,
                    });
                }
                else {
                    values.push(blendIngredients[i].blendNutrients[j]);
                }
            }
            await blendIngredient_1.default.findOneAndUpdate({ _id: blendIngredients[i]._id }, { blendNutrients: values });
            // console.log(i);
        }
        return 'done';
    }
    /**
     * This function changes the value of GI (Glycemic Index) for a given ingredient and returns the GL (Glycemic Load) based on the new GI.
     *
     * @param {String} ingredientId - The ID of the ingredient for which the GI needs to be changed.
     * @param {Number} GI - The new value of the GI.
     * @return {Object} - An object containing the total GI (Glycemic Index), net carbs, and total GL (Glycemic Load) based on the new GI.
     */
    async changeGIandGetGL(ingredientId, GI) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: ingredientId,
        }).select('portions');
        if (!ingredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        let defaultPortion = ingredient.portions.filter(
        //@ts-ignore
        (portion) => portion.default === true)[0];
        if (!defaultPortion) {
            defaultPortion = ingredient.portions[0];
        }
        // console.log(defaultPortion.meausermentWeight);
        let ingredientsInfo = [
            {
                ingredientId: String(ingredient._id),
                value: Number(+defaultPortion.meausermentWeight),
            },
        ];
        /**
         * Retrieves the blend nutrition based on the provided blend ingredient information.
         *
         * @param {BlendIngredientInfo[]} ingredientsInfo - The blend ingredient information.
         * @return {ReturnType} The blend nutrition based on the provided blend ingredient information.
         */
        let AuthUser = (ingredientsInfo) => {
            return (0, getBlendNutritionBasedOnRecipexxx_1.default)(ingredientsInfo);
        };
        let data = await AuthUser(ingredientsInfo);
        let obj = JSON.parse(data);
        let totalCarbs = obj.Energy['total carbs'].value
            ? obj.Energy['total carbs'].value
            : 0;
        let dietaryFiber = obj.Energy['total carbs'].childs['dietary fiber']
            ? obj.Energy['total carbs'].childs['dietary fiber'].value
            : 0;
        let netCarbs = totalCarbs - dietaryFiber;
        let totalGL = netCarbs * (+GI / 100);
        // console.log(totalGL);
        return {
            totalGi: GI,
            netCarbs: netCarbs,
            totalGL: totalGL,
        };
    }
    /**
     * Calculates the Gl and Net Carbs for the given versionId.
     *
     * @param {string} versionId - The ID of the recipe version
     * @return {object} - An object containing the totalGi, netCarbs, and totalGL
     */
    async getGlAndNetCarbs(versionId) {
        let recipeVersion = await RecipeVersionModel_1.default.findOne({
            _id: versionId,
        }).populate({
            path: 'ingredients.ingredientId',
            model: 'BlendIngredient',
        });
        let overAllCarbs = 0;
        let overAllFiber = 0;
        let overAllGi = 0;
        let res = []; //
        for (let i = 0; i < recipeVersion.ingredients.length; i++) {
            let ingredient = await blendIngredient_1.default.findOne({
                _id: recipeVersion.ingredients[i].ingredientId._id,
            }).select('portions');
            if (!ingredient) {
                // console.log(recipeVersion.ingredients[i].ingredientId._id);
                return new AppError_1.default('Ingredient not found', 404);
            }
            let defaultPortion = ingredient.portions.filter(
            //@ts-ignore
            (portion) => portion.default === true)[0];
            if (!defaultPortion) {
                defaultPortion = ingredient.portions[0];
            }
            let ingredientsInfo = [
                {
                    ingredientId: String(ingredient._id),
                    value: Number(+defaultPortion.meausermentWeight),
                },
            ];
            let AuthUser = (ingredientsInfo) => {
                return (0, getBlendNutritionBasedOnRecipexxx_1.default)(ingredientsInfo);
            };
            let data = await AuthUser(ingredientsInfo);
            let obj = JSON.parse(data);
            let totalCarbs = obj.Energy['total carbs'].value
                ? obj.Energy['total carbs'].value
                : 0;
            let dietaryFiber = obj.Energy['total carbs'].childs['dietary fiber']
                ? obj.Energy['total carbs'].childs['dietary fiber'].value
                : 0;
            let netCarbs = totalCarbs - dietaryFiber;
            let totalGL = netCarbs * (55 / 100);
            res.push({
                //@ts-ignore
                _id: recipeVersion.ingredients[i]._id,
                gl: totalGL,
                gi: ingredient.gi ? ingredient.gi : 55,
                netCarbs: netCarbs,
            });
            console.log('gi', ingredient.gi);
            overAllGi += 55;
            overAllCarbs += totalCarbs;
            overAllFiber += dietaryFiber;
        }
        let result = res.map((item) => {
            return {
                _id: item._id,
                percentageOfCarbs: (100 / overAllCarbs) * item.netCarbs,
                percentageOfGi: (100 / overAllGi) * item.gi,
                totalPercentage: (100 / overAllGi) * item.gi + (100 / overAllCarbs) * item.netCarbs,
            };
        });
        //@ts-Ignore
        let totalGi = result.reduce((acc, item) => {
            acc += item.totalPercentage;
            return acc;
        }, 0);
        console.log(totalGi);
        let netCarbs = overAllCarbs - overAllFiber;
        let totalGL = (totalGi * netCarbs) / 100;
        // console.log(totalGi, netCarbs, totalGL);
        return {
            totalGi: totalGi,
            netCarbs: netCarbs,
            totalGL: totalGL,
        };
    }
    async addGiToTheIngredients() {
        await memberModel_1.default.updateMany({}, { blenderManufacturer: '' });
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]) //admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default])
    /**
     * Retrieves all class one ingredients from the database.
     *
     * @return {Promise<Array<any>>} An array of class one ingredients.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllClassOneIngredients", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendIngredient_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "EditIngredient", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendIngredientData_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendIngredientById", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendPortion_1.default]) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendIngredientPortionById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "removeBlendIngredientFromSrc", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "removeABlendIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddBlendIngredient_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addNewBlendIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnBlendIngredient_1.default),
    __param(0, (0, type_graphql_1.Arg)('srcId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addNewBlendIngredientFromSrc", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]) //BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [IngredientFilter_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "filterIngredientByCategoryAndClass", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReturnBlendIngredientBasedOnDefaultPortion_1.default)
    /**
     * Retrieves blend ingredient information based on the default portion.
     *
     * @param {string} ingredientId - The ID of the ingredient
     * @return {Promise<any>} - The retrieved blend ingredient information
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendIngredientInfoBasedOnDefaultPortion", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]) // client
    ,
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "searchBlendIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeId')),
    __param(1, (0, type_graphql_1.Arg)('isVersion')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipeData", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientsWithGiGl_1.default) // BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeId', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('versionId', (type) => type_graphql_1.ID, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getNutrientsListAndGiGlByRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    // async addScrappedRecipeIngredients() {
    //   let sr = await ScrappedRecipe.find();
    //   for (let i = 0; i < sr.length; i++) {
    //     await ScrappedRecipe.findOneAndUpdate(
    //       {
    //         _id: sr[i]._id,
    //       },
    //       {
    //         recipeIngredients: sr[i].recipeCuisines,
    //       }
    //     );
    //   }
    //   return 'done';
    // }
    ,
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateScrappedRecipe_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "saveScrappedRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('blendPortions', (type) => [BlendPortionInput_1.default])),
    __param(1, (0, type_graphql_1.Arg)('blendIngredientId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "manipulatePortionsToBlendIngredient", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('recipeIngredients', (type) => [String], { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "checkParsing", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "tempEditRecipeByAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "removeAllAddedByAdminRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipe_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addRecipeFromAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => NutrientListAndGiGlForScrapper_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeIngredients', (type) => [String], { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('url', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('userId', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('isClient', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "searchInScrappedRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientsWithGiGl_1.default)
    /**
     * Retrieves the list of nutrients and GI/GL values based on the given ingredients information.
     *
     * @param {BlendIngredientInfo[]} ingredientsInfo - An array of BlendIngredientInfo objects representing the ingredients information.
     * @return {Promise<{ nutrients: any[]; giGl: any[]; }>} A Promise that resolves to an object containing the list of nutrients and GI/GL values.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getNutrientsListAndGiGlByIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientListAndGiGlForScrapper_1.default)
    /**
     * Retrieves the list of nutrients and GI/GL values for a given list of ingredients
     * to be used for the scrapping panel.
     *
     * @param {BlendIngredientInfo[]} ingredientsInfo - The information about the blend ingredients.
     * @return {Promise<{nutrients: type, giGl: type}>} - The list of nutrients and GI/GL values.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getNutrientsListAndGiGlByIngredientsForScrappingPanel", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) //BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __param(1, (0, type_graphql_1.Arg)('mySearch', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionForScrappingPanel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [IngredientForWiki_1.default])
    /**
     * Retrieves all ingredients data based on nutrition.
     *
     * @param {GetIngredientsFromNutrition} data - The data containing the nutrition ID and category.
     * @return {any} An array of ingredients sorted by their value in descending order.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetIngredientsFromNutrition_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllIngredientsDataBasedOnNutrition", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Asynchronously changes the blend nutrients.
     *
     * @return {Promise<string>} The result of the function.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeBlendNutrients", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Change the blend nutrients.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the blend nutrients are successfully changed.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeBlendNutrients23", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Asynchronously changes the water value.
     *
     * @return {string} The string 'done' indicating the function has finished.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeWaterValue", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GIGl_1.default)
    /**
     * This function changes the value of GI (Glycemic Index) for a given ingredient and returns the GL (Glycemic Load) based on the new GI.
     *
     * @param {String} ingredientId - The ID of the ingredient for which the GI needs to be changed.
     * @param {Number} GI - The new value of the GI.
     * @return {Object} - An object containing the total GI (Glycemic Index), net carbs, and total GL (Glycemic Load) based on the new GI.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __param(1, (0, type_graphql_1.Arg)('GI')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeGIandGetGL", null);
__decorate([
    (0, type_graphql_1.Query)((type) => GIGl_1.default)
    /**
     * Calculates the Gl and Net Carbs for the given versionId.
     *
     * @param {string} versionId - The ID of the recipe version
     * @return {object} - An object containing the totalGi, netCarbs, and totalGL
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getGlAndNetCarbs", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addGiToTheIngredients", null);
BlendIngredientResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendIngredientResolver);
exports.default = BlendIngredientResolver;
