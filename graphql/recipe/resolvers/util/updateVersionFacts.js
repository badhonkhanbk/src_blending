"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RecipeFacts_1 = __importDefault(require("../../../../models/RecipeFacts"));
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
const getNutrientsAndGiGl_1 = __importDefault(require("./getNutrientsAndGiGl"));
async function updateVersionFacts(recipeVersionId) {
    let version = await RecipeVersionModel_1.default.findOne({
        _id: recipeVersionId,
    });
    if (version.ingredients.length === 0) {
        return;
    }
    //@ts-ignore
    let ingredientInfos = version.ingredients.map((ingredient) => {
        return {
            ingredientId: String(ingredient.ingredientId),
            value: ingredient.weightInGram,
        };
    });
    let versionFact = await RecipeFacts_1.default.findOne({
        versionId: version._id,
    });
    let data = await (0, getNutrientsAndGiGl_1.default)(ingredientInfos);
    let nutrients = JSON.parse(data.nutrients);
    let giGl = data.giGl;
    let calories = nutrients.Calories;
    let energy = nutrients.Energy;
    let minerals = nutrients.Minerals;
    let vitamins = nutrients.Vitamins;
    let calorieTrees = Object.keys(calories);
    let formatedCalorie = await getFormatedNutrient(calories[calorieTrees[0]]);
    if (versionFact) {
        await RecipeFacts_1.default.findOneAndUpdate({ versionId: version._id }, {
            calorie: formatedCalorie,
            gigl: giGl,
            energy: [],
            mineral: [],
            vitamin: [],
        });
    }
    else {
        await RecipeFacts_1.default.create({
            versionId: version._id,
            recipeId: version.recipeId,
            gigl: giGl,
            calorie: formatedCalorie,
        });
    }
    let energyTrees = Object.keys(energy);
    let mineralsTress = Object.keys(minerals);
    let vitaminsTrees = Object.keys(vitamins);
    for (let i = 0; i < energyTrees.length; i++) {
        let formatedEnergy = await getFormatedNutrient(energy[energyTrees[i]]);
        await RecipeFacts_1.default.findOneAndUpdate({
            versionId: version._id,
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
        await RecipeFacts_1.default.findOneAndUpdate({
            versionId: version._id,
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
        await RecipeFacts_1.default.findOneAndUpdate({
            versionId: version._id,
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
async function getFormatedNutrient(data) {
    return {
        value: data.value,
        blendNutrientRefference: data.blendNutrientRefference._id,
        parent: data.blendNutrientRefference.parent,
    };
}
async function getChildsNutrient(childs, versionId, type) {
    let childsKey = Object.keys(childs);
    for (let i = 0; i < childsKey.length; i++) {
        //@ts-ignore
        let formatedData = await getFormatedNutrient(childs[childsKey[i]]);
        if (type === 'energy') {
            await RecipeFacts_1.default.findOneAndUpdate({ versionId: versionId }, {
                $push: {
                    energy: formatedData,
                },
            });
        }
        else if (type === 'mineral') {
            await RecipeFacts_1.default.findOneAndUpdate({ versionId: versionId }, {
                $push: {
                    mineral: formatedData,
                },
            });
        }
        else {
            await RecipeFacts_1.default.findOneAndUpdate({ versionId: versionId }, {
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
