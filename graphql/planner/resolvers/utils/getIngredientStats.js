"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getIngredientsStats(recipes) {
    let ingredients = {};
    for (let i = 0; i < recipes.length; i++) {
        if (ingredients[recipes[i].name]) {
            ingredients[recipes[i].name].count += 1;
        }
        else {
            ingredients[recipes[i].name] = {
                ...recipes[i],
                count: 1,
            };
        }
    }
    let keys = Object.keys(ingredients);
    let sortedIngredients = keys
        .map((key) => ingredients[key])
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
    return sortedIngredients;
}
exports.default = getIngredientsStats;
