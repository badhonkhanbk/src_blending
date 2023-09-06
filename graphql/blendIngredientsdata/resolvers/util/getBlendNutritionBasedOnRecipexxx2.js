"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const blendIngredient_1 = __importDefault(require("../../../../models/blendIngredient"));
const blendNutrientCategory_1 = __importDefault(require("../../../../models/blendNutrientCategory"));
const getTopLevelChilds_1 = __importDefault(require("./getTopLevelChilds"));
async function getBlendNutritionBasedOnRecipexxx2(
// @Arg('ingredientsInfo', (type) => [BlendIngredientInfo])
ingredientsInfo) {
    // //bishakota
    // let data: any = ingredientsInfo;
    // // @ts-ignore
    // let hello = data.map((x) => new mongoose.mongo.ObjectId(x.ingredientId));
    // let selctedNutritions = [
    //   '620b4608b82695d67f28e19c',
    //   '620b4609b82695d67f28e19f',
    // ].map((x) => new mongoose.mongo.ObjectId(x));
    // let ingredients: any;
    // ingredients = await BlendIngredientModel.find({
    //   _id: { $in: hello },
    //   // status: 'Active',
    // })
    //   .populate({
    //     path: 'blendNutrients.blendNutrientRefference',
    //     model: 'BlendNutrient',
    //     match: {
    //       _id: {
    //         $in: selctedNutritions,
    //       },
    //     },
    //     select:
    //       '-bodies -wikiCoverImages -wikiFeatureImage -wikiDescription -wikiTitle -isPublished -related_sources',
    //   })
    //   .sort({ rank: 1 })
    //   .lean();
    // ingredients[0].blendNutrients = ingredients[0].blendNutrients.filter(
    //   //@ts-ignore
    //   (bn) => bn.blendNutrientRefference
    // );
    // for (let i = 0; i < ingredients.length; i++) {
    //   let value = data.filter(
    //     // @ts-ignore
    //     (y) => y.ingredientId === String(ingredients[i]._id)
    //   )[0].value;
    //   for (let j = 0; j < ingredients[i].blendNutrients.length; j++) {
    //     ingredients[i].blendNutrients[j].value =
    //       (+ingredients[i].blendNutrients[j].value / 100) * value;
    //   }
    // }
    // let nutrients = [];
    // for (let i = 0; i < ingredients.length; i++) {
    //   let temp = ingredients[i];
    //   temp.blendNutrients = temp.blendNutrients.filter(
    //     // @ts-ignore
    //     (bn) =>
    //       bn.value !== 0 && +bn.blendNutrientRefference.min_measure < +bn.value
    //   );
    //   nutrients.push(...temp.blendNutrients);
    // }
    // //@ts-ignore
    // let returnNutrients = nutrients.reduce((acc, nutrient) => {
    //   //@ts-ignore
    //   let obj = acc.find(
    //     //@ts-ignore
    //     (o) =>
    //       String(o.blendNutrientRefference._id) ===
    //       String(nutrient.blendNutrientRefference._id)
    //   );
    //   if (!obj) {
    //     nutrient.count = 1;
    //     acc.push(nutrient);
    //   } else {
    //     //@ts-ignore
    //     const index = acc.findIndex((element, index) => {
    //       if (
    //         String(element.blendNutrientRefference._id) ===
    //         String(obj.blendNutrientRefference._id)
    //       ) {
    //         return true;
    //       }
    //     });
    //     acc[index].count++;
    //     acc[index].value = +acc[index].value + +nutrient.value;
    //   }
    //   return acc;
    // }, []);
    // let blendNutrientCategories = await BlendNutrientCategory.find()
    //   .lean()
    //   .select('_id categoryName')
    //   .lean();
    // let obj: any = {};
    // for (let i = 0; i < blendNutrientCategories.length; i++) {
    //   obj[blendNutrientCategories[i].categoryName] = await getTopLevelChilds(
    //     blendNutrientCategories[i]._id,
    //     returnNutrients
    //   );
    // }
    // return JSON.stringify(obj);
    //bishakota
    let data = ingredientsInfo;
    // console.log(data);
    // @ts-ignore
    let hello = data.map((x) => new mongoose_1.default.mongo.ObjectId(x.ingredientId));
    // console.log(hello);
    let selctedNutritions = [
        '620b4608b82695d67f28e19c',
        '620b4609b82695d67f28e19f',
    ].map((x) => new mongoose_1.default.mongo.ObjectId(x));
    let ingredients;
    // console.log('selected', selctedNutritions);
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
    // console.log(ingredients);
    if (ingredients.length === 0) {
        console.log('error');
    }
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
        obj[blendNutrientCategories[i].categoryName] = await (0, getTopLevelChilds_1.default)(blendNutrientCategories[i]._id, returnNutrients);
    }
    return JSON.stringify(obj);
}
exports.default = getBlendNutritionBasedOnRecipexxx2;
