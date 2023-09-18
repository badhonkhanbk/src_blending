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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const planComment_1 = __importDefault(require("../../../models/planComment"));
const CreateNewPlanComment_1 = __importDefault(require("./input-type/PlanComment/CreateNewPlanComment"));
const EditPlanComment_1 = __importDefault(require("./input-type/PlanComment/EditPlanComment"));
const PlanComment_1 = __importDefault(require("../schemas/planComment/PlanComment"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let PlanCommentsResolver = class PlanCommentsResolver {
    /**
     * Creates a new plan comment.
     *
     * @param {CreateNewPlanComment} data - The data for creating the new plan comment.
     * @return {Promise<object>} The newly created plan comment.
     */
    async createPlanComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let newComment = await planComment_1.default.create(data);
        return {
            //@ts-ignore
            ...newComment._doc,
            commentsCount: await planComment_1.default.countDocuments({
                planId: data.planId,
            }),
            memberId: user,
        };
    }
    /**
     * Edits a plan comment.
     *
     * @param {EditPlanComment} data - the data for editing the plan comment
     * @return {Promise<object>} the edited plan comment and the member ID of the user
     */
    async editPlanComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        let blogComment = await planComment_1.default.findOne({ _id: data.editId });
        if (!blogComment) {
            return new AppError_1.default('Comment not found', 404);
        }
        if (String(data.memberId) !== String(blogComment.memberId)) {
            return new AppError_1.default('You are not the owner of this comment', 400);
        }
        let editedComment = await planComment_1.default.findOneAndUpdate({
            _id: data.editId,
        }, {
            comment: data.editableObject.comment,
            updatedAt: Date.now(),
        }, {
            new: true,
        });
        return {
            //@ts-ignore
            ...editedComment._doc,
            memberId: user,
        };
    }
    /**
     * Retrieves all comments for a specific plan.
     *
     * @param {String} planId - The ID of the plan.
     * @return {Array} An array of comments for the plan.
     */
    async getAllCommentsForAPlan(planId) {
        let comments = await planComment_1.default.find({
            planId,
        }).populate({
            path: 'memberId',
            model: 'User',
            select: 'displayName email firstName lastName image',
        });
        return comments;
    }
    /**
     * Removes a plan comment.
     *
     * @param {String} commentId - The ID of the comment to be removed.
     * @param {String} memberId - The ID of the member who owns the comment.
     * @return {String} The result of the comment removal operation.
     */
    async removeAPlanComment(commentId, memberId) {
        let blogComment = await planComment_1.default.findOne({ _id: commentId });
        if (!blogComment) {
            return new AppError_1.default('Comment not found', 404);
        }
        if (String(memberId) !== String(blogComment.memberId)) {
            return new AppError_1.default('You are not the owner of this comment', 400);
        }
        await planComment_1.default.findOneAndDelete({ _id: commentId });
        return await planComment_1.default.countDocuments({
            planId: blogComment.planId,
        });
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanComment_1.default)
    /**
     * Creates a new plan comment.
     *
     * @param {CreateNewPlanComment} data - The data for creating the new plan comment.
     * @return {Promise<object>} The newly created plan comment.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewPlanComment_1.default]),
    __metadata("design:returntype", Promise)
], PlanCommentsResolver.prototype, "createPlanComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanComment_1.default)
    /**
     * Edits a plan comment.
     *
     * @param {EditPlanComment} data - the data for editing the plan comment
     * @return {Promise<object>} the edited plan comment and the member ID of the user
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditPlanComment_1.default]),
    __metadata("design:returntype", Promise)
], PlanCommentsResolver.prototype, "editPlanComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => [PlanComment_1.default])
    /**
     * Retrieves all comments for a specific plan.
     *
     * @param {String} planId - The ID of the plan.
     * @return {Array} An array of comments for the plan.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanCommentsResolver.prototype, "getAllCommentsForAPlan", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Number)
    /**
     * Removes a plan comment.
     *
     * @param {String} commentId - The ID of the comment to be removed.
     * @param {String} memberId - The ID of the member who owns the comment.
     * @return {String} The result of the comment removal operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('commentId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCommentsResolver.prototype, "removeAPlanComment", null);
PlanCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanCommentsResolver);
exports.default = PlanCommentsResolver;
