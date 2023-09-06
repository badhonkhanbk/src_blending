"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendNutrient_1 = __importDefault(require("../../../../models/blendNutrient"));
const getChild_1 = __importDefault(require("./getChild"));
async function getTopLevelChilds(category, returnNutrients) {
    let obj = {};
    let childs = await blendNutrient_1.default.find({
        category: category,
        parentIsCategory: true,
    })
        .lean()
        .select('_id')
        .sort({ rank: 1 });
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
        // console.log(obj);
        // console.log(populatedChild2[i].blendNutrientRefference._id);
        obj[name.toLowerCase()].childs = await (0, getChild_1.default)(String(populatedChild2[i].blendNutrientRefference._id), returnNutrients);
    }
    return obj;
}
exports.default = getTopLevelChilds;
