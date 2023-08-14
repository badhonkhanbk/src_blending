"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendIngredient_1 = __importDefault(require("../models/blendIngredient"));
const blendNutrient_1 = __importDefault(require("../models/blendNutrient"));
const wiki_1 = __importDefault(require("../models/wiki"));
const AppError_1 = __importDefault(require("./AppError"));
/**
 * This function adds or removes a wiki entry based on the provided entity ID and type.
 *
 * @param {String} entityId - The ID of the entity.
 * @param {String} type - The type of the entity.
 * @returns {Promise<void>} - A promise that resolves once the operation is complete.
 */
async function addOrRemoveAWiki(entityId, type) {
    let wikiData;
    // Check if the type is 'BlendIngredient'
    if (type === 'BlendIngredient') {
        // Find the blend ingredient by ID and select the necessary fields
        let blendIngredient = await blendIngredient_1.default.findOne({
            _id: entityId,
        }).select('wikiTitle _id ingredientName wikiDescription category blendStatus createdAt portions featuredImage description isPublished');
        // If the blend ingredient is not found, return an error
        if (!blendIngredient) {
            return new AppError_1.default('Ingredient not found', 404);
        }
        // Create the wiki data object for the blend ingredient
        wikiData = {
            _id: String(blendIngredient._id),
            onModel: 'BlendIngredient',
            wikiTitle: blendIngredient.wikiTitle
                ? blendIngredient.wikiTitle
                : blendIngredient.ingredientName,
            wikiDescription: blendIngredient.wikiDescription
                ? blendIngredient.wikiDescription
                : ' ',
            type: 'Ingredient',
            status: blendIngredient.blendStatus,
            image: blendIngredient.featuredImage,
            description: blendIngredient.description,
            isPublished: false,
        };
    }
    // Check if the type is 'BlendNutrient'
    else if (type === 'BlendNutrient') {
        // Find the blend nutrient by ID and select the necessary fields
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: entityId,
        }).select('-uniqueNutrientId -related_sources -parent -bodies -wikiCoverImages');
        // If the blend nutrient is not found, return an error
        if (!blendNutrient) {
            return new AppError_1.default('Nutrient not found', 404);
        }
        // Create the wiki data object for the blend nutrient
        wikiData = {
            _id: String(blendNutrient._id),
            onModel: 'BlendNutrient',
            wikiTitle: blendNutrient.wikiTitle
                ? blendNutrient.wikiTitle
                : blendNutrient.nutrientName,
            wikiDescription: blendNutrient.wikiDescription
                ? blendNutrient.wikiDescription
                : ' ',
            type: 'Nutrient',
            status: blendNutrient.status,
            description: '',
            image: '',
            isPublished: false,
        };
    }
    // Find the wiki entry by entity ID
    let wiki = await wiki_1.default.findOne({ _id: entityId });
    // If the wiki entry exists, delete it
    if (wiki) {
        await wiki_1.default.deleteOne({
            _id: entityId,
        });
    }
    // If the wiki entry doesn't exist, create it
    else {
        await wiki_1.default.create(wikiData);
    }
    return 'Done';
}
exports.default = addOrRemoveAWiki;
