"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendIngredient_1 = __importDefault(require("../../../../models/blendIngredient"));
const blendNutrient_1 = __importDefault(require("../../../../models/blendNutrient"));
const mongoose_1 = __importDefault(require("mongoose"));
async function getSearchedBlendNutrition(ingredientsInfo, mySearch) {
    let data = ingredientsInfo;
    // @ts-ignore
    let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
    let ingredients;
    ingredients = await blendIngredient_1.default.find({
        _id: { $in: hello },
    })
        .sort({ rank: 1 })
        .lean()
        .select('-bodies -notBlendNutrients');
    for (let i = 0; i < ingredients.length; i++) {
        // console.log(data);
        let value = data.filter(
        // @ts-ignore
        (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
        for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
            if (!mySearch.includes(String(ingredients[i].blendNutrients[j].blendNutrientRefference))) {
                ingredients[i].blendNutrients.splice(j, 1);
                j--;
                continue;
            }
            ingredients[i].blendNutrients[j].value =
                (+ingredients[i].blendNutrients[j].value / 100) * +value;
        }
    }
    // console.log('x');
    let nutrients = [];
    for (let i = 0; i < ingredients.length; i++) {
        let temp = ingredients[i];
        nutrients.push(...temp.blendNutrients);
    }
    //@ts-ignore
    let returnNutrients = nutrients.reduce((acc, nutrient) => {
        //@ts-ignore
        let obj = acc.find(
        //@ts-ignore
        (o) => String(o.blendNutrientRefference) ===
            String(nutrient.blendNutrientRefference));
        if (!obj) {
            nutrient.count = 1;
            acc.push(nutrient);
        }
        else {
            //@ts-ignore
            const index = acc.findIndex((element, index) => {
                if (String(element.blendNutrientRefference) ===
                    String(obj.blendNutrientRefference)) {
                    return true;
                }
            });
            acc[index].count++;
            acc[index].value = +acc[index].value + +nutrient.value;
        }
        return acc;
    }, []);
    let returnData = [];
    for (let i = 0; i < returnNutrients.length; i++) {
        let blendNutrient = await blendNutrient_1.default.findOne({
            _id: returnNutrients[i].blendNutrientRefference,
        }).select('nutrientName units');
        let data = {
            value: returnNutrients[i].value,
            name: blendNutrient.nutrientName,
            units: blendNutrient.units,
        };
        returnData.push(data);
    }
    return returnData;
}
exports.default = getSearchedBlendNutrition;
