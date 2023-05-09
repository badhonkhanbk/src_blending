"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const CreateComment_1 = __importDefault(require("./input-type/CreateComment"));
const RemoveComment_1 = __importDefault(require("./input-type/RemoveComment"));
const EditComment_1 = __importDefault(require("./input-type/EditComment"));
const GetAllComments_1 = __importDefault(require("./input-type/GetAllComments"));
const RecipeComments_1 = __importDefault(require("../schemas/RecipeComments"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const comment_1 = __importDefault(require("../../../models/comment"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const ReturnRatingInfo_1 = __importDefault(require("../schemas/ReturnRatingInfo"));
let UserCommentsResolver = class UserCommentsResolver {
    // @Query(() => Boolean)
    // async notyrPola() {
    //   await UserRecipeProfile.updateMany(
    //     {
    //       personalRating: null,
    //     },
    //     {
    //       personalRating: 0,
    //     }
    //   );
    //   return 'done';
    // }
    async changeRecipeRating(userId, recipeId, rating) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: recipeId }).select('numberOfRating averageRating totalRating');
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            userId: userId,
            recipeId: recipeId,
        }).select('personalRating');
        let count = 0;
        let totalRating = 0;
        if (userRecipe.personalRating !== 0) {
            count = 0;
            totalRating = recipe.totalRating + rating - userRecipe.personalRating;
        }
        else {
            count = 1;
            totalRating = recipe.totalRating + rating;
        }
        let averageRating = totalRating / (recipe.numberOfRating + count);
        let returnRecipe = await recipeModel_1.default.findOneAndUpdate({ _id: recipeId }, {
            $inc: { numberOfRating: count },
            $set: { averageRating, totalRating },
        }, { new: true });
        await UserRecipeProfile_1.default.findOneAndUpdate({
            userId: userId,
            recipeId: recipeId,
        }, {
            personalRating: rating,
        });
        return {
            numberOfRating: recipe.numberOfRating + count,
            averageRating,
            myRating: rating,
        };
    }
    async createComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        await comment_1.default.create(data);
        // let averageRating =
        //   (recipe.totalRating + data.rating) / (recipe.numberOfRating + 1);
        // let returnRecipe = await RecipeModel.findOneAndUpdate(
        //   { _id: data.recipeId },
        //   {
        //     $inc: { numberOfRating: 1, totalRating: data.rating },
        //     $set: { averageRating },
        //   },
        //   { new: true }
        // );
        let otherComments = await comment_1.default.find({
            recipeId: data.recipeId,
        })
            .populate('userId')
            .sort({
            createdAt: -1,
        });
        return { comments: otherComments, recipe: recipe };
    }
    async getAllCommentsForARecipe(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comments = await comment_1.default.find({
            recipeId: data.recipeId,
        })
            .populate('userId')
            .sort({
            createdAt: -1,
        });
        return { comments, recipe };
    }
    async removeComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        console.log(recipe);
        let comment = await comment_1.default.findOne({
            _id: data.commentId,
            recipeId: data.recipeId,
            userId: data.userId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        console.log('comment', comment);
        // let totalRating = recipe.totalRating - comment.rating;
        // let numberOfRating = recipe.numberOfRating - 1;
        // console.log(totalRating, numberOfRating);
        // console.log(recipe.totalRating, recipe.numberOfRating);
        // let averageRating;
        // if (numberOfRating === 0) {
        //   averageRating = 0;
        // } else {
        //   averageRating = totalRating / numberOfRating;
        // }
        await comment_1.default.deleteOne({ _id: data.commentId });
        // let returnRecipe = await RecipeModel.findOneAndUpdate(
        //   { _id: data.recipeId },
        //   { numberOfRating, totalRating, averageRating },
        //   { new: true }
        // );
        let comments = await comment_1.default.find({
            recipeId: data.recipeId,
        })
            .populate('userId')
            .sort({
            createdAt: -1,
        });
        return { comments, recipe: recipe };
    }
    async editComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipeModel_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let comment = await comment_1.default.findOne({
            _id: data.editId,
            userId: data.userId,
            recipeId: data.recipeId,
        });
        if (!comment) {
            return new AppError_1.default('Comment not found', 404);
        }
        // let totalRating =
        //   recipe.totalRating - comment.rating + data.editableObject.rating;
        // let averageRating;
        // if (totalRating === 0) {
        //   averageRating = 0;
        // } else {
        //   averageRating = totalRating / recipe.numberOfRating;
        // }
        // let returnRecipe = await RecipeModel.findOneAndUpdate(
        //   { _id: data.recipeId },
        //   { totalRating, averageRating },
        //   { new: true }
        // );
        let newData = data.editableObject;
        newData.updatedAt = Date.now();
        let newComment = await comment_1.default.findOneAndUpdate({ _id: data.editId }, newData, { new: true }).populate('userId');
        console.log(newComment);
        console.log(data.editId);
        let comments = await comment_1.default.find({
            recipeId: data.recipeId,
        })
            .populate('userId')
            .sort({
            createdAt: -1,
        });
        return { comments, recipe: recipe };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnRatingInfo_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('recipeId')),
    __param(2, (0, type_graphql_1.Arg)('Rating')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Number]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "changeRecipeRating", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "createComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetAllComments_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "getAllCommentsForARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "removeComment", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => RecipeComments_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditComment_1.default]),
    __metadata("design:returntype", Promise)
], UserCommentsResolver.prototype, "editComment", null);
UserCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserCommentsResolver);
exports.default = UserCommentsResolver;
