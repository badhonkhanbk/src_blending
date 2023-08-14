"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blendIngredient_1 = __importDefault(require("../../../../models/blendIngredient"));
const blendNutrient_1 = __importDefault(require("../../../../models/blendNutrient"));
const blendNutrientCategory_1 = __importDefault(require("../../../../models/blendNutrientCategory"));
/**
 * Retrieves the list of nutrients and GI/GL values based on the provided ingredients information.
 *
 * @param {BlendIngredientInfo[]} ingredientsInfo - The information about the blend ingredients.
 * @return {Promise<{ nutrients: any; giGl: any; }>} - The Promise that resolves to an object containing the list of nutrients and the GI/GL values.
 */
async function getNutrientsListAndGiGlByIngredients(ingredientsInfo) {
    let nutrientList = await getBlendNutritionBasedOnRecipexxx(ingredientsInfo);
    // console.log(nutrientList);
    let giGl = await getGlAndNetCarbs2(ingredientsInfo);
    const returnData = {
        nutrients: nutrientList,
        giGl: giGl,
    };
    return returnData;
}
exports.default = getNutrientsListAndGiGlByIngredients;
async function getGlAndNetCarbs2(ingredientsInfo) {
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
        }).select('gi gl netCarbs rxScore');
        if (!blendIngredient.gi || blendIngredient.gi === 0) {
            blendIngredient.gi = 55;
        }
        let netCarbs = totalCarbs - dietaryFiber;
        let totalGL = netCarbs * (blendIngredient.gi / 100);
        res.push({
            _id: ingredientsInfo[i].ingredientId,
            gl: totalGL,
            gi: blendIngredient.gi ? blendIngredient.gi : 55,
            netCarbs: netCarbs,
            rxScore: blendIngredient.rxScore ? blendIngredient.rxScore : 20,
        });
        console.log('gi', blendIngredient.gi);
        overAllGi += 55;
        overAllCarbs += totalCarbs;
        overAllFiber += dietaryFiber;
    }
    res = res.filter((resItem) => resItem.netCarbs !== 0);
    if (res.length === 0) {
        return {
            totalGi: 0,
            netCarbs: 0,
            totalGL: 0,
        };
    }
    if (res.length === 1) {
        return {
            totalGi: res[0].gi,
            netCarbs: res[0].netCarbs,
            totalGL: res[0].gl,
            rxScore: res[0].rxScore,
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
    console.log(totalGi);
    let netCarbs = overAllCarbs - overAllFiber;
    let totalGL = (totalGi * netCarbs) / 100;
    return {
        totalGi: totalGi,
        netCarbs: netCarbs,
        totalGL: totalGL,
    };
}
async function getChild(parent, returnNutrients) {
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
        childs[i].childs = await getChild(childs[i].blendNutrientRefference._id, returnNutrients);
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
async function getTopLevelChilds(category, returnNutrients) {
    let obj = {};
    let childs = await blendNutrient_1.default.find({
        category: category,
        parentIsCategory: true,
    })
        .lean()
        .select('_id')
        .sort({ rank: 1 });
    //@ts-ignore
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
        obj[name.toLowerCase()].childs = await getChild(populatedChild2[i].blendNutrientRefference._id, returnNutrients);
    }
    return obj;
}
async function getBlendNutritionBasedOnRecipexxx2(ingredientsInfo) {
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
        obj[blendNutrientCategories[i].categoryName] = await getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
    }
    return JSON.stringify(obj);
}
async function getBlendNutritionBasedOnRecipexxx(ingredientsInfo) {
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
        .lean();
    // console.log(ingredients.length);
    for (let i = 0; i < ingredients.length; i++) {
        // console.log(ingredients[i]);
        let value = data.filter(
        // @ts-ignore
        (y) => y.ingredientId === String(ingredients[i]._id))[0].value;
        // if (!value) {
        //   console.log(ingredients[i]);
        // }
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
        obj[blendNutrientCategories[i].categoryName] = await getTopLevelChilds(blendNutrientCategories[i]._id, returnNutrients);
    }
    return JSON.stringify(obj);
}
