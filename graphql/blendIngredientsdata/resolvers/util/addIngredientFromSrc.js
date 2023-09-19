"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const AppError_1 = __importDefault(require("../../../../utils/AppError"));
const ingredient_1 = __importDefault(require("../../../../models/ingredient"));
const blendIngredient_1 = __importDefault(require("../../../../models/blendIngredient"));
const mapToBlend_1 = __importDefault(require("../../../../models/mapToBlend"));
/**
 * Adds an ingredient from a source by its ID.
 *
 * @param {String} srcId - The ID of the source food.
 * @return {Promise<any>} - The newly created blend ingredient.
 */
async function addIngredientFromSrc(srcId) {
    let srcFood = await ingredient_1.default.findOne({ _id: srcId });
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
        blendStatus: 'X',
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
    //@ts-ignore
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
                valueInNumber: +srcFood.nutrients[i].value,
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
exports.default = addIngredientFromSrc;
