"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plan_1 = __importDefault(require("../models/Plan"));
const blendIngredient_1 = __importDefault(require("../models/blendIngredient"));
const generalBlog_1 = __importDefault(require("../models/generalBlog"));
const recipe_1 = __importDefault(require("../models/recipe"));
const wiki_1 = __importDefault(require("../models/wiki"));
function getGenericModel(collectionType) {
    if (collectionType === 'Ingredient') {
        return blendIngredient_1.default;
    }
    else if (collectionType === 'Recipe') {
        return recipe_1.default;
    }
    else if (collectionType === 'Wiki') {
        return wiki_1.default;
    }
    else if (collectionType === 'GeneralBlog') {
        return generalBlog_1.default;
    }
    else if (collectionType === 'Plan') {
        return Plan_1.default;
    }
    else {
        return null;
    }
}
exports.default = getGenericModel;
