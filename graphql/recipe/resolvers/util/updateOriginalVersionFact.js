// import RecipeFactModel from '../../../../models/recipeOriginalFactModel';
// import RecipeVersionModel from '../../../../models/RecipeVersionModel';
// import getBlendNutrientsAndGiGl from './getNutrientsAndGiGl';
// export default async function updateOriginalVersionFacts(
//   recipeVersionId: string
// ) {
//   let version: any = await RecipeVersionModel.findOne({
//     _id: recipeVersionId,
//   });
//   if (version.ingredients.length === 0) {
//     return;
//   }
//   //@ts-ignore
//   let ingredientInfos = version.ingredients.map((ingredient) => {
//     return {
//       ingredientId: String(ingredient.ingredientId),
//       value: ingredient.weightInGram,
//     };
//   });
//   let versionFact = await RecipeFactModel.findOne({
//     versionId: version._id,
//   });
//   let data = await getBlendNutrientsAndGiGl(ingredientInfos);
//   let nutrients = JSON.parse(data.nutrients);
//   let giGl = data.giGl;
//   let calories = nutrients.Calories;
//   let energy = nutrients.Energy;
//   let minerals = nutrients.Minerals;
//   let vitamins = nutrients.Vitamins;
//   let calorieTrees = Object.keys(calories);
//   let formatedCalorie = await getFormatedNutrient(calories[calorieTrees[0]]);
//   if (versionFact) {
//     await RecipeFactModel.findOneAndUpdate(
//       { versionId: version._id },
//       {
//         calorie: formatedCalorie,
//         gigl: giGl,
//         energy: [],
//         mineral: [],
//         vitamin: [],
//       }
//     );
//   } else {
//     await RecipeFactModel.create({
//       versionId: version._id,
//       recipeId: version.recipeId,
//       gigl: giGl,
//       calorie: formatedCalorie,
//     });
//   }
//   let energyTrees = Object.keys(energy);
//   let mineralsTress = Object.keys(minerals);
//   let vitaminsTrees = Object.keys(vitamins);
//   for (let i = 0; i < energyTrees.length; i++) {
//     let formatedEnergy = await getFormatedNutrient(energy[energyTrees[i]]);
//     await RecipeFactModel.findOneAndUpdate(
//       {
//         versionId: version._id,
//       },
//       {
//         $push: {
//           energy: formatedEnergy,
//         },
//       }
//     );
//     if (energy[energyTrees[i]].childs) {
//       await getChildsNutrient(
//         energy[energyTrees[i]].childs,
//         version._id,
//         'energy'
//       );
//     }
//   }
//   for (let i = 0; i < mineralsTress.length; i++) {
//     let formatedMineral = await getFormatedNutrient(minerals[mineralsTress[i]]);
//     await RecipeFactModel.findOneAndUpdate(
//       {
//         versionId: version._id,
//       },
//       {
//         $push: {
//           mineral: formatedMineral,
//         },
//       }
//     );
//     if (minerals[mineralsTress[i]].childs) {
//       await getChildsNutrient(
//         minerals[mineralsTress[i]].childs,
//         version._id,
//         'mineral'
//       );
//     }
//   }
//   for (let i = 0; i < vitaminsTrees.length; i++) {
//     let formatedVitamin = await getFormatedNutrient(vitamins[vitaminsTrees[i]]);
//     await RecipeFactModel.findOneAndUpdate(
//       {
//         versionId: version._id,
//       },
//       {
//         $push: {
//           vitamin: formatedVitamin,
//         },
//       }
//     );
//     if (vitamins[vitaminsTrees[i]].childs) {
//       await getChildsNutrient(
//         vitamins[vitaminsTrees[i]].childs,
//         version._id,
//         'vitamin'
//       );
//     }
//   }
//   return 'done';
// }
// async function getFormatedNutrient(data: any) {
//   return {
//     value: data.value,
//     blendNutrientRefference: data.blendNutrientRefference._id,
//     parent: data.blendNutrientRefference.parent,
//   };
// }
// async function getChildsNutrient(
//   childs: any[],
//   versionId: string,
//   type: string
// ) {
//   let childsKey = Object.keys(childs);
//   for (let i = 0; i < childsKey.length; i++) {
//     //@ts-ignore
//     let formatedData = await getFormatedNutrient(childs[childsKey[i]]);
//     if (type === 'energy') {
//       await RecipeFactModel.findOneAndUpdate(
//         { versionId: versionId },
//         {
//           $push: {
//             energy: formatedData,
//           },
//         }
//       );
//     } else if (type === 'mineral') {
//       await RecipeFactModel.findOneAndUpdate(
//         { versionId: versionId },
//         {
//           $push: {
//             mineral: formatedData,
//           },
//         }
//       );
//     } else {
//       await RecipeFactModel.findOneAndUpdate(
//         { versionId: versionId },
//         {
//           $push: {
//             vitamin: formatedData,
//           },
//         }
//       );
//     }
//     if (
//       //@ts-ignore
//       childs[childsKey[i]].childs
//     ) {
//       await getChildsNutrient(
//         //@ts-ignore
//         childs[childsKey[i]].childs,
//         versionId,
//         type
//       );
//     }
//   }
//   return;
// }
