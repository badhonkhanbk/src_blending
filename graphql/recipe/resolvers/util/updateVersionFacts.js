"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import RecipeFactModel from '../../../../models/RecipeFacts';
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
const getNutrientsAndGiGl_1 = __importDefault(require("./getNutrientsAndGiGl"));
/**
 * Updates the version facts for a recipe version.
 *
 * @param {string} recipeVersionId - The ID of the recipe version to update.
 * @return {Promise<void>} A Promise that resolves when the update is complete.
 */
async function updateVersionFacts(recipeVersionId) {
    let version = await RecipeVersionModel_1.default.findOne({
        _id: recipeVersionId,
    });
    if (version.ingredients.length === 0) {
        await RecipeVersionModel_1.default.findOneAndUpdate({ _id: version._id }, {
            calorie: {
                value: 0,
                blendNutrientRefference: '620b4606b82695d67f28e193',
                parent: null,
            },
            gigl: {
                totalGi: 0,
                netCarbs: 0,
                totalGL: 0,
            },
            energy: [],
            mineral: [],
            vitamin: [],
        });
        return;
    }
    //@ts-ignore
    let ingredientInfos = version.ingredients.map((ingredient) => {
        return {
            ingredientId: String(ingredient.ingredientId),
            value: ingredient.weightInGram,
        };
    });
    let versionFact = await RecipeVersionModel_1.default.findOne({
        _id: version._id,
    });
    let data = await (0, getNutrientsAndGiGl_1.default)(ingredientInfos);
    // console.log('xxxx', data);
    let nutrients = JSON.parse(data.nutrients);
    let giGl = data.giGl;
    let calories = nutrients.Calories;
    let energy = nutrients.Energy;
    let minerals = nutrients.Minerals;
    let vitamins = nutrients.Vitamins;
    let calorieTrees = Object.keys(calories);
    let formatedCalorie = {};
    if (calorieTrees.length === 0) {
        formatedCalorie = {
            value: 0,
            blendNutrientRefference: '620b4606b82695d67f28e193',
            parent: null,
        };
    }
    else {
        formatedCalorie = await getFormatedNutrient(calories[calorieTrees[0]]);
    }
    if (versionFact) {
        await RecipeVersionModel_1.default.findOneAndUpdate({ _id: version._id }, {
            calorie: formatedCalorie,
            gigl: giGl,
            energy: [],
            mineral: [],
            vitamin: [],
        });
    }
    // console.log('EEEE', energy);
    let energyTrees = Object.keys(energy);
    let mineralsTress = Object.keys(minerals);
    let vitaminsTrees = Object.keys(vitamins);
    for (let i = 0; i < energyTrees.length; i++) {
        // console.log('hdichkjsdvkjcbdkj', energy[energyTrees[i]]);
        let formatedEnergy = await getFormatedNutrient(energy[energyTrees[i]]);
        await RecipeVersionModel_1.default.findOneAndUpdate({
            _id: version._id,
        }, {
            $push: {
                energy: formatedEnergy,
            },
        });
        if (energy[energyTrees[i]].childs) {
            await getChildsNutrient(energy[energyTrees[i]].childs, version._id, 'energy');
        }
    }
    for (let i = 0; i < mineralsTress.length; i++) {
        let formatedMineral = await getFormatedNutrient(minerals[mineralsTress[i]]);
        await RecipeVersionModel_1.default.findOneAndUpdate({
            _id: version._id,
        }, {
            $push: {
                mineral: formatedMineral,
            },
        });
        if (minerals[mineralsTress[i]].childs) {
            await getChildsNutrient(minerals[mineralsTress[i]].childs, version._id, 'mineral');
        }
    }
    for (let i = 0; i < vitaminsTrees.length; i++) {
        let formatedVitamin = await getFormatedNutrient(vitamins[vitaminsTrees[i]]);
        await RecipeVersionModel_1.default.findOneAndUpdate({
            _id: version._id,
        }, {
            $push: {
                vitamin: formatedVitamin,
            },
        });
        if (vitamins[vitaminsTrees[i]].childs) {
            await getChildsNutrient(vitamins[vitaminsTrees[i]].childs, version._id, 'vitamin');
        }
    }
    return 'done';
}
exports.default = updateVersionFacts;
/**
 * Formats the given nutrient data.
 *
 * @param {any} data - The nutrient data to be formatted.
 * @return {object} - The formatted nutrient data.
 */
async function getFormatedNutrient(data) {
    // console.log('Data', data);
    return {
        value: data.value ? data.value : 0,
        blendNutrientRefference: data.blendNutrientRefference._id,
        parent: data.blendNutrientRefference.parent,
    };
}
/**
 * Retrieves the nutrient information for each child in the given array of child objects and updates the recipe version with the formatted nutrient data.
 *
 * @param {any[]} childs - An array of child objects.
 * @param {string} versionId - The ID of the recipe version.
 * @param {string} type - The type of nutrient ('energy', 'mineral', or 'vitamin').
 * @return {Promise<void>} A Promise that resolves when the nutrient information has been updated for all child objects.
 */
async function getChildsNutrient(childs, versionId, type) {
    let childsKey = Object.keys(childs);
    for (let i = 0; i < childsKey.length; i++) {
        //@ts-ignore
        let formatedData = await getFormatedNutrient(childs[childsKey[i]]);
        if (type === 'energy') {
            await RecipeVersionModel_1.default.findOneAndUpdate({ _id: versionId }, {
                $push: {
                    energy: formatedData,
                },
            });
        }
        else if (type === 'mineral') {
            await RecipeVersionModel_1.default.findOneAndUpdate({ _id: versionId }, {
                $push: {
                    mineral: formatedData,
                },
            });
        }
        else {
            await RecipeVersionModel_1.default.findOneAndUpdate({ _id: versionId }, {
                $push: {
                    vitamin: formatedData,
                },
            });
        }
        if (
        //@ts-ignore
        childs[childsKey[i]].childs) {
            await getChildsNutrient(
            //@ts-ignore
            childs[childsKey[i]].childs, versionId, type);
        }
    }
    return;
}
