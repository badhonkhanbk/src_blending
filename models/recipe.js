// import { model, Schema } from 'mongoose';
// const recipeSchema = new Schema({
//   mainEntityOfPage: String,
//   name: String,
//   image: [{ image: String, default: Boolean }],
//   servings: {
//     type: Number,
//     default: 1,
//   },
//   datePublished: String,
//   description: String, // version
//   prepTime: String, // version
//   cookTime: String, // version
//   totalTime: String, // version
//   recipeYield: String, // version
//   recipeCuisines: [String], // version
//   author: [String],
//   recipeBlendCategory: {
//     type: Schema.Types.ObjectId,
//     ref: 'RecipeCategory',
//     default: '61cafd4d668ec5e10720a943',
//   },
//   brand: { type: Schema.Types.ObjectId, ref: 'RecipeBrand' },
//   foodCategories: [String], // version
//   //NOTE:
//   recipeInstructions: [String], // version
//   servingSize: {
//     // version
//     type: Number,
//     default: 0,
//   },
//   ingredients: [
//     //version
//     {
//       ingredientId: { type: Schema.Types.ObjectId, ref: 'BlendIngredient' },
//       selectedPortion: { name: String, quantity: Number, gram: Number },
//       weightInGram: Number,
//       portions: [
//         { name: String, quantiy: Number, default: Boolean, gram: Number },
//       ],
//     },
//   ],
//   //NOTE:
//   isPublished: {
//     type: Boolean,
//     default: false,
//   },
//   url: String,
//   favicon: String,
//   // blendStatus:
//   addedByAdmin: {
//     type: Boolean,
//     default: false,
//   },
//   userId: {
//     type: Schema.Types.ObjectId,
//     ref: 'User',
//   },
//   adminIds: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'Admin',
//     },
//   ],
//   discovery: {
//     type: Boolean,
//     default: false,
//   },
//   global: { type: Boolean, default: false },
//   numberOfRating: { type: Number, default: 0 },
//   totalRating: { type: Number, default: 0 },
//   totalViews: { type: Number, default: 0 },
//   averageRating: { type: Number, default: 0 },
//   seoTitle: String,
//   seoSlug: String,
//   seoCanonicalURL: String,
//   seoSiteMapPriority: Number,
//   seoKeywords: [String],
//   seoMetaDescription: String,
//   collections: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'AdminCollection',
//     },
//   ],
//   recipeVersion: [{ type: Schema.Types.ObjectId, ref: 'RecipeVersion' }],
//   createdAt: { type: Date, default: Date.now },
//   originalVersion: { type: Schema.Types.ObjectId, ref: 'RecipeVersion' },
//   defaultVersion: { type: Schema.Types.ObjectId, ref: 'RecipeVersion' },
//   editedAt: Date,
//   isMatch: { type: Boolean, default: true },
//   tempAdmin: Boolean,
// });
// const Recipe = model('Recipe', recipeSchema);
// export default Recipe;
