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
let BlendIngredientResolver = class BlendIngredientResolver {
    async getAllBlendIngredients() {
        let blendIngredients = await blendIngredient_1.default.find()
            .lean()
            .populate('varrient')
            .select('-blendNutrients -notBlendNutrients -wikiCoverImages -wikiFeatureImage -wikiTitle -wikiDescription -bodies -seoTitle -seoSlug -seoCanonicalURL -seoSiteMapPriority -seoKeywords -seoMetaDescription -isPublished')
            .sort({ ingredientName: 1 });
        return blendIngredients;
    }
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
            console.log('no default portion');
            await blendIngredient_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        }
        else {
            let newData = food;
            //@ts-ignore
            let newPortions = [];
            for (let i = 0; i < newData.portions.length; i++) {
                if (String(newData.portions[i]._id) ===
                    String(data.editableObject.defaultPortion)) {
                    console.log('matched');
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
        if (food.blendStatus !== 'Archive') {
            return new AppError_1.default('you can not remove Review or Active Ingredient', 404);
        }
        await ingredient_1.default.findByIdAndUpdate(food.srcFoodReference, {
            addedToBlend: false,
        });
        await blendIngredient_1.default.findOneAndRemove({ _id: id });
        return 'BlendIngredient removed';
    }
    async addNewBlendIngredient(data) {
        await blendIngredient_1.default.create(data);
        return 'BlendIngredient added';
    }
    async addNewBlendIngredientFromSrc(srcId) {
        let srcFood = await ingredient_1.default.findById(srcId);
        if (!srcFood) {
            return new AppError_1.default('Food not found in src', 404);
        }
        let blendIngredientWithTheSrcId = await blendIngredient_1.default.findOne({
            srcFoodReference: srcId,
        });
        if (blendIngredientWithTheSrcId) {
            return new AppError_1.default('BlendIngredient already exists with that ID', 404);
        }
        let portions;
        if (srcFood.portions.length === 0) {
            portions = [
                {
                    measurement: 'cup',
                    measurement2: 'undetermined',
                    meausermentWeight: '100',
                    default: true,
                },
            ];
        }
        else {
            //@ts-ignore
            portions = srcFood.portions.map((portion) => {
                return {
                    measurement: portion.measurement,
                    measurement2: portion.measurement2,
                    meausermentWeight: portion.meausermentWeight,
                    default: false,
                };
            });
        }
        let newBlendIngredient = {
            ingredientName: srcFood.description
                ? srcFood.description
                : srcFood.ingredientName,
            blendStatus: 'Review',
            classType: '',
            description: srcFood.description,
            srcFoodReference: srcFood._id,
            portions: portions,
        };
        if (srcFood.source === 'sr_legacy_food') {
            newBlendIngredient.sourceName = 'USDA-Legacy';
        }
        else if (srcFood.source === 'foundation_food') {
            newBlendIngredient.sourceName = 'survey_fndds_food';
        }
        else {
            newBlendIngredient.sourceName = 'USDA-survey';
        }
        newBlendIngredient.notBlendNutrients = [];
        newBlendIngredient.blendNutrients = [];
        for (let i = 0; i < srcFood.nutrients.length; i++) {
            let found = await mapToBlend_1.default.findOne({
                srcUniqueNutrientId: srcFood.nutrients[i].uniqueNutrientRefference,
            });
            if (!found) {
                newBlendIngredient.notBlendNutrients.push(srcFood.nutrients[i]);
            }
            else {
                let nutrient = {
                    value: srcFood.nutrients[i].value,
                    blendNutrientRefference: found.blendNutrientId,
                    uniqueNutrientReferrence: srcFood.nutrients[i].uniqueNutrientRefference,
                };
                newBlendIngredient.blendNutrients.push(nutrient);
                newBlendIngredient.notBlendNutrients.push(srcFood.nutrients[i]);
            }
        }
        // console.log(newBlendIngredient);
        let newBlendData = await blendIngredient_1.default.create(newBlendIngredient);
        await ingredient_1.default.findByIdAndUpdate(srcId, { addedToBlend: true });
        return newBlendData;
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
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
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
        let nutrientList = await this.getBlendNutritionBasedOnRecipexxx(ingredientsInfo);
        console.log(nutrientList);
        let giGl = await this.getGlAndNetCarbs2(ingredientsInfo);
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
    async addScrappedRecipeFromUser(data) {
        let ingredientsShape = [
            {
                recipeIngredients: data.recipeIngredients,
            },
        ];
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
        let bestMatchCount = 0;
        for (let i = 0; i < res.data[0].parsed_data.length; i++) {
            let blendIngredient = null;
            if (res.data[0].parsed_data[i].best_match.length > 4) {
                bestMatchCount = 4;
            }
            else {
                bestMatchCount = res.data[0].parsed_data[i].best_match.length;
            }
            //res.data[0].parsed_data[i].best_match.length
            for (let j = 0; j < bestMatchCount; j++) {
                blendIngredient = await blendIngredient_1.default.findOne({
                    srcFoodReference: res.data[0].parsed_data[i].best_match[j].db_ingredient_id,
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
                    // console.log(blendIngredient);
                    break;
                }
            }
            if (!blendIngredient) {
                notBlends.push(res.data[0].parsed_data[i]);
            }
            else {
                // console.log('blend', blendIngredient, res.data[0].parsed_data[i]);
                blends.push({
                    ingredientId: blendIngredient._id,
                    quantity: res.data[0].parsed_data[i].QUANTITY,
                    unit: res.data[0].parsed_data[i].QUANTITY_UNIT,
                    name: res.data[0].parsed_data[i].INGREDIENT,
                    db_name: blendIngredient.ingredientName,
                    comment: res.data[0].parsed_data[i].COMMENT,
                    portions: blendIngredient.portions,
                });
            }
        }
        const parseFraction = (fraction) => {
            const [numerator, denominator] = fraction.split('/').map(Number);
            return numerator / denominator;
        };
        for (let i = 0; i < blends.length; i++) {
            if (!blends[i].unit) {
                continue;
            }
            for (let j = 0; j < blends[i].portions.length; j++) {
                if (blends[i].unit === blends[i].portions[j].measurement) {
                    blends[i].value =
                        blends[i].quantity * blends[i].portions[j].meausermentWeight;
                    blends[i].unit = 'g';
                    if (!blends[i].value) {
                        blends[i].value =
                            parseFraction(blends[i].quantity) *
                                blends[i].portions[j].meausermentWeight;
                    }
                }
            }
            if (!blends[i].value) {
                if (!+blends[i].quantity) {
                    let converted = (0, ingredient_unit_converter_1.converter)(parseFraction(blends[i].quantity), blends[i].unit, blends[i].portions[0].measurement);
                    if (converted.error) {
                        blends[i].error = converted.error;
                        portionsProblem.push(blends[i]);
                        continue;
                    }
                    blends[i].value =
                        converted.quantity * blends[i].portions[0].meausermentWeight;
                }
                else {
                    let converted = (0, ingredient_unit_converter_1.converter)(blends[i].quantity, blends[i].unit, blends[i].portions[0].measurement);
                    if (converted.error) {
                        blends[i].error = converted.error;
                        portionsProblem.push(blends[i]);
                        continue;
                    }
                    blends[i].value =
                        converted.quantity * blends[i].portions[0].meausermentWeight;
                }
            }
        }
        blends = blends
            .filter((blend) => blend.value)
            .map((blend) => {
            return {
                ingredientId: String(blend.ingredientId),
                value: blend.value,
            };
        });
        let myData = await this.getNutrientsListAndGiGlByIngredients(blends);
        return myData;
    }
    async getNutrientsListAndGiGlByIngredients(ingredientsInfo) {
        let nutrientList = await this.getBlendNutritionBasedOnRecipexxx(ingredientsInfo);
        let giGl = await this.getGlAndNetCarbs2(ingredientsInfo);
        return {
            nutrients: nutrientList,
            giGl: giGl,
        };
    }
    async getBlendNutritionBasedOnRecipexxx(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let ingredients;
        ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
            // status: 'Active',
        })
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            select: '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
        })
            .sort({ rank: 1 })
            .lean()
            .select('-bodies -notBlendNutrients');
        for (let i = 0; i < ingredients.length; i++) {
            console.log(data);
            let value = data.filter(
            // @ts-ignore
            (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
            for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
                ingredients[i].blendNutrients[j].value =
                    (+ingredients[i].blendNutrients[j].value / 100) * +value;
            }
        }
        let nutrients = [];
        for (let i = 0; i < ingredients.length; i++) {
            let temp = ingredients[i];
            temp.blendNutrients = temp.blendNutrients.filter(
            // @ts-ignore
            (bn) => bn.value !== 0 &&
                bn.value > 0.5 &&
                +bn.blendNutrientRefference.min_measure < +bn.value);
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
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
        }
        return JSON.stringify(obj);
    }
    async getChild(parent, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({ parent: parent })
            .lean()
            .select('_id nutrientName altName')
            .sort({ rank: 1 });
        if (childs.length === 0) {
            return null;
        }
        for (let i = 0; i < childs.length; i++) {
            let mathchedNutrient = returnNutrients.filter((nutrient) => String(nutrient.blendNutrientRefference._id) === String(childs[i]._id))[0];
            if (!mathchedNutrient) {
                // obj[name.toLowerCase()] = null;
                continue;
            }
            childs[i] = mathchedNutrient;
            childs[i].childs = await this.getChild(childs[i].blendNutrientRefference._id, returnNutrients);
            let check1 = childs[i].blendNutrientRefference.altName === '';
            let check2 = childs[i].blendNutrientRefference.altName === undefined;
            let check3 = childs[i].blendNutrientRefference.altName === null;
            let check = check1 || check2 || check3;
            let name2 = check
                ? childs[i].blendNutrientRefference.nutrientName
                : childs[i].blendNutrientRefference.altName;
            // console.log(name2, check);
            // if (name2 === null) {
            //   console.log(name2, check, childs[i].blendNutrientRefference.altName);
            // }
            obj[name2.toLowerCase()] = childs[i];
        }
        return obj;
    }
    async getTopLevelChilds(category, returnNutrients) {
        let obj = {};
        let childs = await blendNutrient_1.default.find({
            category: category,
            parentIsCategory: true,
        })
            .lean()
            .select('_id')
            .sort({ rank: 1 });
        let populatedChild = childs.map((child) => {
            let data = returnNutrients.filter((rn) => String(rn.blendNutrientRefference._id) === String(child._id))[0];
            if (!data) {
                data = {
                    value: 0,
                    blendNutrientRefference: null,
                };
            }
            return data;
        });
        let populatedChild2 = populatedChild.filter(
        //@ts-ignore
        (child) => child.blendNutrientRefference !== null);
        for (let i = 0; i < populatedChild2.length; i++) {
            let check1 = populatedChild2[i].blendNutrientRefference.altName === '';
            let check2 = populatedChild2[i].blendNutrientRefference.altName === undefined;
            let check3 = populatedChild2[i].blendNutrientRefference.altName === null;
            let check = check1 || check2 || check3;
            //  ||
            // populatedChild2[i].blendNutrientRefference.altName !== undefined ||
            // populatedChild2[i].blendNutrientRefference.altName !== null;
            let name = check
                ? populatedChild2[i].blendNutrientRefference.nutrientName
                : populatedChild2[i].blendNutrientRefference.altName;
            // if (name === null) {
            //   console.log(name, check3);
            // }
            obj[name.toLowerCase()] = populatedChild2[i];
            obj[name.toLowerCase()].childs = await this.getChild(populatedChild2[i].blendNutrientRefference._id, returnNutrients);
        }
        return obj;
    }
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
        let AuthUser = (ingredientsInfo) => {
            return this.getBlendNutritionBasedOnRecipexxx(ingredientsInfo);
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
        return totalGL.toString();
    }
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
                return this.getBlendNutritionBasedOnRecipexxx(ingredientsInfo);
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
                gi: 55,
                netCarbs: netCarbs,
            });
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
        let netCarbs = overAllCarbs - overAllFiber;
        let totalGL = (totalGi * netCarbs) / 100;
        // console.log(totalGi, netCarbs, totalGL);
        return {
            totalGi: totalGi,
            netCarbs: netCarbs,
            totalGL: totalGL,
        };
    }
    async getGlAndNetCarbs2(ingredientsInfo) {
        let res = [];
        let overAllGi = 0;
        let overAllCarbs = 0;
        let overAllFiber = 0;
        for (let i = 0; i < ingredientsInfo.length; i++) {
            let AuthUser = (info) => {
                return this.getBlendNutritionBasedOnRecipexxx2(info);
            };
            let data = await AuthUser([ingredientsInfo[i]]);
            // console.log(data);
            let obj = JSON.parse(data);
            // console.log(obj);
            let totalCarbs = obj.Energy['total carbs']
                ? obj.Energy['total carbs'].value
                : 0;
            let dietaryFiber = 0;
            if (totalCarbs !== 0) {
                dietaryFiber = obj.Energy['total carbs'].childs['dietary fiber']
                    ? obj.Energy['total carbs'].childs['dietary fiber'].value
                    : 0;
            }
            let blendIngredient = await blendIngredient_1.default.findOne({
                _id: ingredientsInfo[i].ingredientId,
            }).select('gi');
            if (!blendIngredient.gi || blendIngredient.gi === 0) {
                blendIngredient.gi = 55;
            }
            let netCarbs = totalCarbs - dietaryFiber;
            let totalGL = netCarbs * (blendIngredient.gi / 100);
            res.push({
                _id: ingredientsInfo[i].ingredientId,
                gl: totalGL,
                gi: blendIngredient.gi,
                netCarbs: netCarbs,
            });
            overAllGi += 55;
            overAllCarbs += totalCarbs;
            overAllFiber += dietaryFiber;
        }
        let checkLength = res.length;
        res = res.filter((resItem) => resItem.netCarbs !== 0);
        if (checkLength === 1 && res.length === 0) {
            return {
                totalGi: 0,
                netCarbs: 0,
                totalGL: 0,
            };
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
        let netCarbs = overAllCarbs - overAllFiber;
        let totalGL = (totalGi * netCarbs) / 100;
        return {
            totalGi: totalGi,
            netCarbs: netCarbs,
            totalGL: totalGL,
        };
    }
    async getBlendNutritionBasedOnRecipexxx2(ingredientsInfo) {
        let data = ingredientsInfo;
        // @ts-ignore
        let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
        let selctedNutritions = [
            '620b4608b82695d67f28e19c',
            '620b4609b82695d67f28e19f',
        ].map((x) => new mongoose_1.default.mongo.ObjectId(x));
        let ingredients;
        ingredients = await blendIngredient_1.default.find({
            _id: { $in: hello },
            // status: 'Active',
        })
            .populate({
            path: 'blendNutrients.blendNutrientRefference',
            model: 'BlendNutrient',
            match: {
                _id: {
                    $in: selctedNutritions,
                },
            },
            select: '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
        })
            .sort({ rank: 1 })
            .lean();
        ingredients[0].blendNutrients = ingredients[0].blendNutrients.filter(
        //@ts-ignore
        (bn) => bn.blendNutrientRefference);
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
            .select('_id categoryName')
            .lean();
        let obj = {};
        for (let i = 0; i < blendNutrientCategories.length; i++) {
            obj[blendNutrientCategories[i].categoryName] =
                await this.getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
        }
        return JSON.stringify(obj);
    }
    async addGiToTheIngredients() {
        await blendIngredient_1.default.updateMany({}, { $set: { gi: 55 } });
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
    (0, type_graphql_1.Query)(() => [ReturnBlendIngredient_1.default]),
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
    (0, type_graphql_1.Mutation)(() => ReturnBlendIngredient_1.default) //admin
    ,
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
    (0, type_graphql_1.Query)(() => ReturnBlendIngredientBasedOnDefaultPortion_1.default),
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
    (0, type_graphql_1.Mutation)((type) => NutrientsWithGiGl_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateScrappedRecipe_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "addScrappedRecipeFromUser", null);
__decorate([
    (0, type_graphql_1.Query)(() => NutrientsWithGiGl_1.default),
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getNutrientsListAndGiGlByIngredients", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) //BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipexxx", null);
__decorate([
    (0, type_graphql_1.Query)(() => [IngredientForWiki_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetIngredientsFromNutrition_1.default]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getAllIngredientsDataBasedOnNutrition", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeBlendNutrients", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeBlendNutrients23", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeWaterValue", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __param(1, (0, type_graphql_1.Arg)('GI')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Number]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "changeGIandGetGL", null);
__decorate([
    (0, type_graphql_1.Query)((type) => GIGl_1.default),
    __param(0, (0, type_graphql_1.Arg)('versionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getGlAndNetCarbs", null);
__decorate([
    (0, type_graphql_1.Query)((type) => GIGl_1.default),
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getGlAndNetCarbs2", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) //BOTH:
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientsInfo', (type) => [BlendIngredientInfo_1.default])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BlendIngredientResolver.prototype, "getBlendNutritionBasedOnRecipexxx2", null);
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
