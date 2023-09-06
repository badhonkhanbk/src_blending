"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendNutrient_1 = __importDefault(require("../../../../models/blendNutrient"));
async function getChild(parent, returnNutrients) {
    let obj = {};
    let childs = await blendNutrient_1.default.find({ parent: parent })
        .lean()
        .select('_id nutrientName altName')
        .sort({ rank: 1 });
    // console.log(childs);
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
exports.default = getChild;
