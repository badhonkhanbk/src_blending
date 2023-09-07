"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendIngredient_1 = __importDefault(require("../../../../models/blendIngredient"));
async function getGlAndNetCarbs2(
// @Arg('ingredientsInfo', (type) => [BlendIngredientInfo])
ingredientsInfo) {
    // let res = [];
    // let overAllGi = 0;
    // let overAllCarbs = 0;
    // let overAllFiber = 0;
    // for (let i = 0; i < ingredientsInfo.length; i++) {
    //   // let AuthUser = (info: BlendIngredientInfo[]) => {
    //   //   return this.getBlendNutritionBasedOnRecipexxx2(info);
    //   // };
    //   // let data = await AuthUser([ingredientsInfo[i]]);
    //   // console.log(ingredientsInfo[i]);
    //   let data = await getBlendNutritionBasedOnRecipexxx2([ingredientsInfo[i]]);
    //   let blendIngredient: any = await BlendIngredientModel.findOne({
    //     _id: ingredientsInfo[i].ingredientId,
    //   }).select('gi gl netCarbs rxScore');
    //   // let data = await getSearchedBlendNutrition(
    //   //   [ingredientsInfo[i]],
    //   //   ['620b4608b82695d67f28e19c', '620b4609b82695d67f28e19f']
    //   // );
    //   // console.log('12', data);
    //   let obj = JSON.parse(data);
    //   // console.log(obj);
    //   let totalCarbs = obj.Energy['total carbs']
    //     ? obj.Energy['total carbs'].value
    //     : 0;
    //   let dietaryFiber = 0;
    //   if (totalCarbs !== 0) {
    //     dietaryFiber = obj.Energy['total carbs'].childs['dietary fiber']
    //       ? obj.Energy['total carbs'].childs['dietary fiber'].value
    //       : 0;
    //   }
    //   console.log('---------');
    //   console.log(ingredientsInfo[i]);
    //   console.log(blendIngredient._id);
    //   console.log(totalCarbs);
    //   console.log(dietaryFiber);
    //   console.log('---------');
    //   if (!blendIngredient.gi || blendIngredient.gi === 0) {
    //     blendIngredient.gi = 55;
    //   }
    //   let netCarbs = totalCarbs - dietaryFiber;
    //   let totalGL = netCarbs * (blendIngredient.gi / 100);
    //   res.push({
    //     _id: ingredientsInfo[i].ingredientId,
    //     gl: totalGL,
    //     gi: blendIngredient.gi ? blendIngredient.gi : 55,
    //     netCarbs: netCarbs,
    //     rxScore: blendIngredient.rxScore ? blendIngredient.rxScore : 20,
    //   });
    //   // console.log('gi', blendIngredient.gi);
    //   overAllGi += 55;
    //   overAllCarbs += totalCarbs;
    //   overAllFiber += dietaryFiber;
    // }
    // res = res.filter((resItem) => resItem.netCarbs !== 0);
    // if (res.length === 0) {
    //   return {
    //     totalGi: 0,
    //     netCarbs: 0,
    //     totalGL: 0,
    //   };
    // }
    // if (res.length === 1) {
    //   return {
    //     totalGi: res[0].gi,
    //     netCarbs: res[0].netCarbs,
    //     totalGL: res[0].gl,
    //     rxScore: res[0].rxScore,
    //   };
    // }
    // let result = res.map((item) => {
    //   return {
    //     _id: item._id,
    //     percentageOfCarbs: (100 / overAllCarbs) * item.netCarbs,
    //     percentageOfGi: (100 / overAllGi) * item.gi,
    //     totalPercentage:
    //       (100 / overAllGi) * item.gi + (100 / overAllCarbs) * item.netCarbs,
    //   };
    // });
    // //@ts-Ignore
    // let totalGi = result.reduce((acc, item) => {
    //   acc += item.totalPercentage;
    //   return acc;
    // }, 0);
    // // console.log(totalGi);
    // let netCarbs = overAllCarbs - overAllFiber;
    // let totalGL = (totalGi * netCarbs) / 100;
    // return {
    //   totalGi: totalGi,
    //   netCarbs: netCarbs,
    //   totalGL: totalGL,
    // };
    let res = [];
    let overAllGi = 0;
    let overAllCarbs = 0;
    let overAllFiber = 0;
    for (let i = 0; i < ingredientsInfo.length; i++) {
        // let AuthUser = (info: BlendIngredientInfo[]) => {
        //   return this.getBlendNutritionBasedOnRecipexxx2(info);
        // };
        // let data = await AuthUser([ingredientsInfo[i]]);
        // console.log(ingredientsInfo[i]);
        // let data = await getBlendNutritionBasedOnRecipexxx2([ingredientsInfo[i]]);
        let blendIngredient = await blendIngredient_1.default.findOne({
            _id: ingredientsInfo[i].ingredientId,
        }).select('gi gl netCarbs rxScore blendNutrients');
        let totalCarbsIndex = blendIngredient.blendNutrients.findIndex((blendNutrient) => String(blendNutrient.blendNutrientRefference) ===
            '620b4608b82695d67f28e19c');
        let dietaryFiberIndex = blendIngredient.blendNutrients.findIndex((blendNutrient) => String(blendNutrient.blendNutrientRefference) ===
            '620b4609b82695d67f28e19f');
        let totalCarbs = totalCarbsIndex !== -1
            ? (+blendIngredient.blendNutrients[totalCarbsIndex].value / 100) *
                +ingredientsInfo[i].value
            : 0;
        let dietaryFiber = dietaryFiberIndex !== -1
            ? (+blendIngredient.blendNutrients[dietaryFiberIndex].value / 100) *
                +ingredientsInfo[i].value
            : 0;
        // console.log('---------');
        // console.log(ingredientsInfo[i]);
        // console.log(blendIngredient._id);
        // console.log(+blendIngredient.blendNutrients[totalCarbsIndex].value);
        // console.log(totalCarbs);
        // console.log(dietaryFiber);
        // console.log('---------');
        // let data = await getSearchedBlendNutrition(
        //   [ingredientsInfo[i]],
        //   ['620b4608b82695d67f28e19c', '620b4609b82695d67f28e19f']
        // );
        // console.log('12', data);
        // let obj = JSON.parse(data);
        // console.log(obj);
        // let totalCarbs = obj.Energy['total carbs']
        //   ? obj.Energy['total carbs'].value
        //   : 0;
        // let dietaryFiber = 0;
        // if (totalCarbs !== 0) {
        //   dietaryFiber = obj.Energy['total carbs'].childs['dietary fiber']
        //     ? obj.Energy['total carbs'].childs['dietary fiber'].value
        //     : 0;
        // }
        // console.log('---------');
        // console.log(ingredientsInfo[i]);
        // console.log(blendIngredient._id);
        // console.log(totalCarbs);
        // console.log(dietaryFiber);
        // console.log('---------');
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
        // console.log('gi', blendIngredient.gi);
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
    // console.log(totalGi);
    let netCarbs = overAllCarbs - overAllFiber;
    let totalGL = (totalGi * netCarbs) / 100;
    return {
        totalGi: totalGi,
        netCarbs: netCarbs,
        totalGL: totalGL,
    };
}
exports.default = getGlAndNetCarbs2;
