// import { model, Schema } from 'mongoose';
// const recipeOriginalFactSchema = new Schema({
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
// const RecipeOriginalFact = model(
//   'RecipeOriginalFact',
//   recipeOriginalFactSchema
// );
// export default RecipeOriginalFact;
// working
