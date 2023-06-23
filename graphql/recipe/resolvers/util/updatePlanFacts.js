"use strict";
// import RecipeFactModel from '../../../../models/RecipeFacts';
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Plan_1 = __importDefault(require("../../../../models/Plan"));
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
const recipeModel_1 = __importDefault(require("../../../../models/recipeModel"));
const getNutrientsAndGiGl_1 = __importDefault(require("./getNutrientsAndGiGl"));
async function updatePlanFacts(planId) {
    let plan = await Plan_1.default.findOne({
        _id: planId,
    });
    let recipeIds = [];
    for (let i = 0; i < plan.planData.length; i++) {
        if (plan.planData[i].recipes.length > 0) {
        }
        recipeIds = recipeIds.concat(plan.planData[i].recipes);
    }
    if (recipeIds.length === 0) {
        await Plan_1.default.findOneAndUpdate({ _id: plan._id }, {
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
    let ingredientInfo = [];
    let ingredients = [];
    for (let i = 0; i < recipeIds.length; i++) {
        let recipe = await recipeModel_1.default.findOne({
            _id: recipeIds[i],
        }).select('originalVersion');
        let version = await RecipeVersionModel_1.default.findOne({
            _id: recipe.originalVersion,
        }).select('ingredients');
        if (!recipe) {
            continue;
        }
        for (let j = 0; j < version.ingredients.length; j++) {
            let index = ingredientInfo.findIndex((el) => el.ingredientId ===
                String(version.ingredients[j].ingredientId));
            if (index === -1) {
                ingredients.push(version.ingredients[j].ingredientId);
                ingredientInfo.push({
                    ingredientId: String(version.ingredients[j].ingredientId),
                    value: version.ingredients[j].weightInGram,
                });
            }
            else {
                ingredientInfo[index].value += version.ingredients[j].weightInGram;
            }
        }
    }
    // console.log(ingredientInfo);
    let data = await (0, getNutrientsAndGiGl_1.default)(ingredientInfo);
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
    await Plan_1.default.findOneAndUpdate({ _id: planId }, {
        gigl: giGl,
    });
    let energyTrees = Object.keys(energy);
    let mineralsTress = Object.keys(minerals);
    let vitaminsTrees = Object.keys(vitamins);
    for (let i = 0; i < energyTrees.length; i++) {
        // console.log('hdichkjsdvkjcbdkj', energy[energyTrees[i]]);
        let formatedEnergy = await getFormatedNutrient(energy[energyTrees[i]]);
        await Plan_1.default.findOneAndUpdate({
            _id: plan._id,
        }, {
            $push: {
                energy: formatedEnergy,
            },
        });
        if (energy[energyTrees[i]].childs) {
            await getChildsNutrient(energy[energyTrees[i]].childs, plan._id, 'energy');
        }
    }
    for (let i = 0; i < mineralsTress.length; i++) {
        let formatedMineral = await getFormatedNutrient(minerals[mineralsTress[i]]);
        await Plan_1.default.findOneAndUpdate({
            _id: plan._id,
        }, {
            $push: {
                mineral: formatedMineral,
            },
        });
        if (minerals[mineralsTress[i]].childs) {
            await getChildsNutrient(minerals[mineralsTress[i]].childs, plan._id, 'mineral');
        }
    }
    for (let i = 0; i < vitaminsTrees.length; i++) {
        let formatedVitamin = await getFormatedNutrient(vitamins[vitaminsTrees[i]]);
        await Plan_1.default.findOneAndUpdate({
            _id: plan._id,
        }, {
            $push: {
                vitamin: formatedVitamin,
            },
        });
        if (vitamins[vitaminsTrees[i]].childs) {
            await getChildsNutrient(vitamins[vitaminsTrees[i]].childs, plan._id, 'vitamin');
        }
    }
    await Plan_1.default.findOneAndUpdate({ _id: plan._id }, {
        ingredients: ingredients,
    });
    return 'done';
}
exports.default = updatePlanFacts;
async function getFormatedNutrient(data) {
    // console.log('Data', data);
    return {
        value: data.value ? data.value : 0,
        blendNutrientRefference: data.blendNutrientRefference._id,
        parent: data.blendNutrientRefference.parent,
    };
}
async function getChildsNutrient(childs, planId, type) {
    let childsKey = Object.keys(childs);
    for (let i = 0; i < childsKey.length; i++) {
        //@ts-ignore
        let formatedData = await getFormatedNutrient(childs[childsKey[i]]);
        if (type === 'energy') {
            await Plan_1.default.findOneAndUpdate({ _id: planId }, {
                $push: {
                    energy: formatedData,
                },
            });
        }
        else if (type === 'mineral') {
            await Plan_1.default.findOneAndUpdate({ _id: planId }, {
                $push: {
                    mineral: formatedData,
                },
            });
        }
        else {
            await Plan_1.default.findOneAndUpdate({ _id: planId }, {
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
            childs[childsKey[i]].childs, planId, type);
        }
    }
    return;
}
