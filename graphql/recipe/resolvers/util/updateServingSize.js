"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const RecipeVersionModel_1 = __importDefault(require("../../../../models/RecipeVersionModel"));
async function updateServingSizeForAllVersions() {
    var _a, _b;
    let recipeVersions = await RecipeVersionModel_1.default.find().select('ingredients');
    for (let i = 0; i < recipeVersions.length; i++) {
        if (recipeVersions[i].ingredients.length > 0) {
            let servingSize = 0;
            for (let j = 0; j < recipeVersions[i].ingredients.length; j++) {
                servingSize +=
                    ((_a = recipeVersions[i].ingredients[j].selectedPortion) === null || _a === void 0 ? void 0 : _a.quantity) *
                        ((_b = recipeVersions[i].ingredients[j].selectedPortion) === null || _b === void 0 ? void 0 : _b.gram) *
                        0.033814;
            }
            await RecipeVersionModel_1.default.findOneAndUpdate({
                _id: recipeVersions[i]._id,
            }, {
                servingSize,
            });
        }
    }
    return 'done';
}
exports.default = updateServingSizeForAllVersions;
