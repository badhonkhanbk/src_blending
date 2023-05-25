// import ShareModel from '../../../models/share';
// import AppError from '../../../utils/AppError';
// import MemberModel from '../../../models/memberModel';
// import RecipeModel from '../../../models/recipe';
// import RecipeVersionModel from '../../../models/RecipeVersionModel';
// import UserNoteModel from '../../../models/userNote';
// import CompareModel from '../../../models/Compare';
// import UserRecipeProfileModel from '../../../models/UserRecipeProfile';
// export default async function (
//   recipeId: String,
//   userId: String,
//   mergeWithUser: String
// ) {
//   const share = await ShareModel.findOne({ _id: token });
//   if (!share) {
//     return null;
//   }
//   if (!share.isGlobal) {
//     let found = false;
//     for (let i = 0; i < share.shareTo.length; i++) {
//       if (
//         String(share.shareTo[i].userId) === userId &&
//         share.shareTo[i].hasAccepted
//       ) {
//         found = true;
//         break;
//       }
//     }
//     if (!found) {
//       return null;
//     }
//   }
//   let res = await checkShareAndAdd(share, userId);
//   if (!res) {
//     return null;
//   }
//   if (share.isGlobal) {
//     await ShareModel.findOneAndUpdate(
//       {
//         _id: token,
//       },
//       {
//         $addToSet: {
//           globalAccepted: userId,
//         },
//       }
//     );
//   }
//   return share.shareData.recipeId;
// }
// async function checkShareAndAdd(share, userId) {
//   let userRecipe = await UserRecipeProfileModel.findOne({
//     userId: userId,
//     recipeId: share.shareData.recipeId,
//   });
//   let recipe = await RecipeModel.findOne({
//     _id: share.shareData.recipeId,
//   }).select('_id originalVersion turnedOn');
//   if (!recipe) {
//     return false;
//   }
//   let version = await RecipeVersionModel.findOne({
//     _id: share.shareData.version,
//   }).select('_id');
//   if (!version) {
//     return false;
//   }
//   if (!userRecipe) {
//     // console.log(userId);
//     // console.log(share)
//     let isMatch: Boolean = false;
//     if (String(recipe.originalVersion) === String(share.shareData.version)) {
//       isMatch = true;
//     }
//     await UserRecipeProfileModel.create({
//       userId: userId,
//       recipeId: share.shareData.recipeId,
//       defaultVersion: share.shareData.version,
//       turnedOnVersions: share.shareData.turnedOnVersions,
//       isMatch: isMatch,
//       allRecipe: false,
//       myRecipes: false,
//     });
//     return true;
//   }
//   let checkDefault =
//     String(share.shareData.version) === String(userRecipe.defaultVersion);
//   if (checkDefault) {
//     // console.log('here');
//     await mergeTurnedOnVersion(
//       userId,
//       share.shareData.recipeId,
//       share.shareData.turnedOnVersions
//     );
//     return true;
//   }
//   let checkOriginal =
//     String(share.shareData.version) === String(recipe.originalVersion);
//   if (checkOriginal) {
//     await mergeTurnedOnVersion(
//       userId,
//       share.shareData.recipeId,
//       share.shareData.turnedOnVersions
//     );
//     return true;
//   }
//   let checkTurnedOn = userRecipe.turnedOnVersions.filter((version) => {
//     return String(version) === String(share.shareData.version);
//   })[0];
//   if (checkTurnedOn) {
//     await mergeTurnedOnVersion(
//       userId,
//       share.shareData.recipeId,
//       share.shareData.turnedOnVersions
//     );
//     return true;
//   }
//   let checkTurnedOff = userRecipe.turnedOffVersions.filter((version) => {
//     return String(version) === String(share.shareData.version);
//   })[0];
//   if (checkTurnedOff) {
//     await mergeTurnedOnVersion(
//       userId,
//       share.shareData.recipeId,
//       share.shareData.turnedOnVersions
//     );
//     return true;
//   }
//   await UserRecipeProfileModel.findOneAndUpdate(
//     {
//       userId: userId,
//       recipeId: share.shareData.recipeId,
//     },
//     {
//       $addToSet: {
//         turnedOnVersions: {
//           $each: [
//             share.shareData.versionId,
//             ...share.shareData.turnedOnVersions,
//           ],
//         },
//       },
//     }
//   );
// }
// async function mergeTurnedOnVersion(
//   userId: String,
//   recipeId: String,
//   newTurnedOn: [String]
// ) {
//   // let convertedTurnedOn = newTurnedOn.map((nt) => String(nt));
//   // console.log(convertedTurnedOn);
//   await UserRecipeProfileModel.findOneAndUpdate(
//     {
//       userId: userId,
//       recipeId: recipeId,
//     },
//     {
//       $addToSet: {
//         turnedOnVersions: {
//           $each: newTurnedOn,
//         },
//       },
//     }
//   );
//   return;
// }
