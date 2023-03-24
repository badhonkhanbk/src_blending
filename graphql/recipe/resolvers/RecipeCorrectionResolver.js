// import { Resolver, Mutation, Arg, Query, UseMiddleware } from 'type-graphql';
// import RecipeOldModel from '../../../models/recipeModel';
// import RecipeModel from '../../../models/recipeModel';
// @Resolver()
// export default class RecipeCorrectionResolver {
//   @Mutation(() => String)
//   async recipeCorrection() {
//     await RecipeModel.deleteMany();
//     let recipes = await RecipeOldModel.find();
//     for (let i = 0; i < recipes.length; i++) {
//       let newRecipe: any = {
//         _id: recipes[i]._id,
//         mainEntityOfPage: recipes[i].mainEntityOfPage,
//         name: recipes[i].name,
//         image: recipes[i].image,
//         servings: recipes[i].servings,
//         datePublished: recipes[i].datePublished,
//         description: recipes[i].description, // version
//         prepTime: recipes[i].prepTime, // version
//         cookTime: recipes[i].cookTime, // version
//         totalTime: recipes[i].totalTime, // version
//         recipeYield: recipes[i].recipeYield, // version
//         recipeCuisines: recipes[i].recipeCuisines, // version
//         author: recipes[i].author,
//         recipeBlendCategory: recipes[i].recipeBlendCategory,
//         brand: recipes[i].brand,
//         foodCategories: recipes[i].foodCategories, // version
//         //NOTE:
//         recipeInstructions: recipes[i].recipeInstructions, // version
//         servingSize: recipes[i].servingSize,
//         isPublished: recipes[i].isPublished,
//         url: recipes[i].url,
//         favicon: recipes[i].favicon,
//         addedByAdmin: recipes[i].addedByAdmin,
//         userId: recipes[i].userId,
//         adminIds: recipes[i].adminIds,
//         discovery: recipes[i].discovery,
//         global: recipes[i].global,
//         numberOfRating: recipes[i].numberOfRating,
//         totalRating: recipes[i].totalRating,
//         totalViews: recipes[i].totalViews,
//         averageRating: recipes[i].averageRating,
//         seoTitle: recipes[i].seoTitle,
//         seoSlug: recipes[i].seoSlug,
//         seoCanonicalURL: recipes[i].seoCanonicalURL,
//         seoSiteMapPriority: recipes[i].seoSiteMapPriority,
//         seoKeywords: recipes[i].seoKeywords,
//         seoMetaDescription: recipes[i].seoMetaDescription,
//         collections: recipes[i].collections,
//         createdAt: recipes[i].createdAt,
//         originalVersion: recipes[i].originalVersion,
//         defaultVersion: recipes[i].defaultVersion,
//         editedAt: recipes[i].editedAt,
//         isMatch: recipes[i].isMatch,
//       };
//       let otherVersions = recipes[i].recipeVersion.filter((rv: any) => {
//         return (
//           String(rv) !== String(recipes[i].defaultVersion) &&
//           String(rv) !== String(recipes[i].originalVersion)
//         );
//       });
//       newRecipe.turnedOnVersions = otherVersions;
//       await RecipeModel.create(newRecipe);
//     }
//     return 'done';
//   }
//   @Query(() => String)
//   async recipeCorrection2() {
//     await RecipeModel.deleteMany();
//     return 'done';
//   }
// }
