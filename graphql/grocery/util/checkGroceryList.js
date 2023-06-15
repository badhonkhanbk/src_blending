"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
async function default_1(data, Model, groceryList) {
    for (let i = 0; i < data.ingredients.length; i++) {
        let ingredient = await blendIngredient_1.default.findOne({
            _id: data.ingredients[i].ingredientId,
        }).select('portions');
        let selectedPortionData = ingredient.portions.filter((portion) => portion.measurement === data.ingredients[i].selectedPortion)[0];
        if (!selectedPortionData) {
            continue;
        }
        let defaultPortion = ingredient.portions.filter((portion) => portion.default)[0];
        if (!defaultPortion) {
            defaultPortion = ingredient.portions[0];
        }
        let newQuantity = data.ingredients[i].quantity;
        if (defaultPortion.measurement !== selectedPortionData.selectedPortion) {
            let baseQuantity = +selectedPortionData.meausermentWeight /
                +defaultPortion.meausermentWeight;
            newQuantity = baseQuantity * +data.ingredients[i].quantity;
        }
        let inList = groceryList.list.filter((gl) => gl.ingredientId.toString() === data.ingredients[i].ingredientId)[0];
        if (inList) {
            // await Model.findOneAndUpdate(
            //   {
            //     _id: groceryList._id,
            //   },
            //   {
            //     $pull: {
            //       list: {
            //         ingredientId: new mongoose.Types.ObjectId(inList.ingredientId),
            //       },
            //     },
            //   }
            // );
            let inListPortion = ingredient.portions.filter((portion) => portion.measurement === inList.selectedPortion)[0];
            if (!inListPortion) {
            }
            else {
                let baseQuantity = +inListPortion.meausermentWeight / +defaultPortion.meausermentWeight;
                let mainQuantity = baseQuantity * +inList.quantity;
                await Model.findOneAndUpdate({
                    _id: groceryList._id,
                    'list.$.ingredientId': inList.ingredientId,
                }, {
                    $set: {
                        'list.$.ingredientId': inList.ingredientId,
                        'list.$.quantity': +mainQuantity + +newQuantity,
                        'list.$.selectedPortion': defaultPortion.measurement,
                    },
                });
            }
        }
        else {
            await Model.findOneAndUpdate({
                _id: groceryList._id,
            }, {
                $push: {
                    list: {
                        ingredientId: data.ingredients[i].ingredientId,
                        quantity: newQuantity,
                        selectedPortion: defaultPortion.measurement,
                    },
                },
            });
        }
    }
}
exports.default = default_1;
