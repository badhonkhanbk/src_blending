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
const blogComment_1 = __importDefault(require("../../../models/blogComment"));
const CreateNewBlogComment_1 = __importDefault(require("./inputType/CreateNewBlogComment"));
const EditBlogComment_1 = __importDefault(require("./inputType/EditBlogComment"));
const BlogComment_1 = __importDefault(require("../schema/BlogComment"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let BlogCommentsResolver = class BlogCommentsResolver {
    /**
     * Creates a new blog comment.
     *
     * @param {CreateNewBlogComment} data - The data for creating the new blog comment.
     * @return {Object} The newly created blog comment with the member ID.
     */
    async createBlogComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let newComment = await blogComment_1.default.create(data);
        return {
            //@ts-ignore
            ...newComment._doc,
            memberId: user,
        };
    }
    /**
     * Edits a blog comment.
     *
     * @param {EditBlogComment} data - The data for editing the blog comment.
     * @return {object} The edited blog comment and the member associated with it.
     */
    async editBlogComment(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        let blogComment = await blogComment_1.default.findOne({ _id: data.editId });
        if (!blogComment) {
            return new AppError_1.default('Comment not found', 404);
        }
        if (String(data.memberId) !== String(blogComment.memberId)) {
            return new AppError_1.default('You are not the owner of this comment', 400);
        }
        let editedComment = await blogComment_1.default.findOneAndUpdate({
            _id: data.editId,
        }, {
            comment: data.editableObject.comment,
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
     * Retrieves all comments for a specific blog.
     *
     * @param {String} blogId - The ID of the blog.
     * @return {Promise<Array<Object>>} An array of comments for the specified blog.
     */
    async getAllCommentsForABlog(blogId) {
        let comments = await blogComment_1.default.find({
            blogId,
        }).populate({
            path: 'memberId',
            model: 'User',
            select: 'displayName email firstName lastName image',
        });
        return comments;
    }
    /**
     * Removes a blog comment.
     *
     * @param {String} commentId - The ID of the comment to be removed.
     * @param {String} memberId - The ID of the member.
     * @return {String} - The result of the operation ('success' if successful).
     */
    async removeABlogComment(commentId, memberId) {
        let blogComment = await blogComment_1.default.findOne({ _id: commentId });
        if (!blogComment) {
            return new AppError_1.default('Comment not found', 404);
        }
        if (String(memberId) !== String(blogComment.memberId)) {
            return new AppError_1.default('You are not the owner of this comment', 400);
        }
        await blogComment_1.default.findOneAndDelete({ _id: commentId });
        return 'success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogComment_1.default)
    /**
     * Creates a new blog comment.
     *
     * @param {CreateNewBlogComment} data - The data for creating the new blog comment.
     * @return {Object} The newly created blog comment with the member ID.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewBlogComment_1.default]),
    __metadata("design:returntype", Promise)
], BlogCommentsResolver.prototype, "createBlogComment", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogComment_1.default)
    /**
     * Edits a blog comment.
     *
     * @param {EditBlogComment} data - The data for editing the blog comment.
     * @return {object} The edited blog comment and the member associated with it.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlogComment_1.default]),
    __metadata("design:returntype", Promise)
], BlogCommentsResolver.prototype, "editBlogComment", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlogComment_1.default])
    /**
     * Retrieves all comments for a specific blog.
     *
     * @param {String} blogId - The ID of the blog.
     * @return {Promise<Array<Object>>} An array of comments for the specified blog.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('blogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlogCommentsResolver.prototype, "getAllCommentsForABlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Removes a blog comment.
     *
     * @param {String} commentId - The ID of the comment to be removed.
     * @param {String} memberId - The ID of the member.
     * @return {String} - The result of the operation ('success' if successful).
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('commentId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], BlogCommentsResolver.prototype, "removeABlogComment", null);
BlogCommentsResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlogCommentsResolver);
exports.default = BlogCommentsResolver;
