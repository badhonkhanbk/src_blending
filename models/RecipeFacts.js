// import { model, Schema } from 'mongoose';
// const recipeFactSchema = new Schema({
//   recipeId: { type: Schema.Types.ObjectId, ref: 'Recipe' },
//   versionId: { type: Schema.Types.ObjectId, ref: 'RecipeVersion' },
//   calorie: {
//     value: Number,
//     blendNutrientRefference: {
//       type: Schema.Types.ObjectId,
//       ref: 'BlendNutrient',
//     },
//     parent: { type: Schema.Types.ObjectId, ref: 'BlendIngredient' },
//   },
//   energy: [
//     {
//       value: Number,
//       blendNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'BlendIngredient',
//       },
//       parent: { type: Schema.Types.ObjectId, ref: 'BlendIngredient' },
//     },
//   ],
//   mineral: [
//     {
//       value: Number,
//       blendNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'BlendIngredient',
//       },
//       parent: { type: Schema.Types.ObjectId, ref: 'BlendIngredient' },
//     },
//   ],
//   vitamin: [
//     {
//       value: Number,
//       blendNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'BlendIngredient',
//       },
//       parent: { type: Schema.Types.ObjectId, ref: 'BlendIngredient' },
//     },
//   ],
//   gigl: {
//     totalGi: Number,
//     netCarbs: Number,
//     totalGL: Number,
//   },
// });
// const RecipeFact = model('RecipeFact', recipeFactSchema);
// export default RecipeFact;
