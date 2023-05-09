"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// import RecipeFactModel from '../../../../models/RecipeFacts';
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
const getNutrientsAndGiGl_1 = __importDefault(require("./getNutrientsAndGiGl"));
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
    console.log('xxxx', data);
    let nutrients = JSON.parse(data.nutrients);
    let giGl = data.giGl;
    let calories = nutrients.Calories;
    let energy = nutrients.Energy;
    let minerals = nutrients.Minerals;
    let vitamins = nutrients.Vitamins;
    let calorieTrees = Object.keys(calories);
    let formatedCalorie = await getFormatedNutrient(calories[calorieTrees[0]]);
    if (versionFact) {
        await RecipeVersionModel_1.default.findOneAndUpdate({ _id: version._id }, {
            calorie: formatedCalorie,
            gigl: giGl,
            energy: [],
            mineral: [],
            vitamin: [],
        });
    }
    let energyTrees = Object.keys(energy);
    let mineralsTress = Object.keys(minerals);
    let vitaminsTrees = Object.keys(vitamins);
    for (let i = 0; i < energyTrees.length; i++) {
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
