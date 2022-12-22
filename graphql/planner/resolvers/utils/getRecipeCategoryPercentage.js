"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
async function getRecipeCategoryPercentage(recipeIds) {
    let categories = {};
    for (let i = 0; i < recipeIds.length; i++) {
        if (categories[recipeIds[i].name]) {
            categories[recipeIds[i].name].count += 1;
            let percentage = (categories[recipeIds[i].name].count / recipeIds.length) * 100;
            categories[recipeIds[i].name].percentage = percentage;
        }
        else {
            categories[recipeIds[i].name] = {
                ...recipeIds[i],
                count: 1,
                percentage: (1 / recipeIds.length) * 100,
            };
        }
    }
    let keys = Object.keys(categories);
    let sortedCategories = keys
        .map((key) => categories[key])
        .sort((a, b) => b.percentage - a.percentage);
    return sortedCategories;
}
exports.default = getRecipeCategoryPercentage;
