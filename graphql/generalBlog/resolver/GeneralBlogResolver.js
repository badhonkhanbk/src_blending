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
const CreateNewGeneralBlog_1 = __importDefault(require("./inputType/CreateNewGeneralBlog"));
const EditGeneralBlog_1 = __importDefault(require("./inputType/EditGeneralBlog"));
const GeneralBlog_1 = __importDefault(require("../schema/GeneralBlog"));
const generalBlog_1 = __importDefault(require("../../../models/generalBlog"));
const blogComment_1 = __importDefault(require("../../../models/blogComment"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const generalBlogCollection_1 = __importDefault(require("../../../models/generalBlogCollection"));
let GeneralBlogResolver = class GeneralBlogResolver {
    async addGeneralBlog(data) {
        let blog = await generalBlog_1.default.findOne({ slug: data.slug });
        if (blog) {
            return new AppError_1.default('Blog Slug already exist', 400);
        }
        if (data.publishDateString) {
            let isoDate = new Date(data.publishDateString).toISOString();
            await generalBlog_1.default.create({
                ...data,
                publishDate: isoDate,
            });
            return 'Successfully added to general blog';
        }
        await generalBlog_1.default.create(data);
        return 'Successfully added to general blog';
    }
    async editAGeneralBlog(data) {
        if (data.editableObject.slug) {
            let blog = await generalBlog_1.default.findOne({
                slug: data.editableObject.slug,
                _id: { $ne: data.editId },
            });
            if (blog) {
                return new AppError_1.default('Blog Slug already exist', 400);
            }
        }
        let modifiedData = {
            ...data.editableObject,
            updatedAt: new Date(),
        };
        if (data.editableObject.publishDateString) {
            let isoDate = new Date(data.editableObject.publishDateString).toISOString();
            modifiedData = {
                ...modifiedData,
                publishDate: isoDate,
            };
        }
        await generalBlog_1.default.findOneAndUpdate({ _id: data.editId }, modifiedData);
        return 'Successfully edited general blog';
    }
    async getAgeneralBlog(blogId, currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        let blog = await generalBlog_1.default.findOne({ _id: blogId });
        return blog;
    }
    async getAgeneralBlogBySlug(slug, memberId) {
        let blog = await generalBlog_1.default.findOne({ slug: slug });
        blog.commentsCount = await blogComment_1.default.countDocuments({
            blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
        });
        blog.commentsCount = await blogComment_1.default.countDocuments({
            blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
        });
        let blogCollections = await generalBlogCollection_1.default.find({
            memberId: memberId,
            blogs: {
                $in: blog._id,
            },
        }).select('_id');
        if (blogCollections.length > 0) {
            blog.hasInCollection = true;
        }
        else {
            blog.hasInCollection = false;
        }
        return blog;
    }
    async getAllGeneralBlog(currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        let blogs = await generalBlog_1.default.find();
        return blogs;
    }
    async getAllGeneralBlogForClient(currentDate, memberId) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        let blogs = await generalBlog_1.default.find({ isPublished: true });
        let returnBlogs = [];
        for (let i = 0; i < blogs.length; i++) {
            let blog = blogs[i];
            blog.commentsCount = await blogComment_1.default.countDocuments({
                blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
            });
            let blogCollections = await generalBlogCollection_1.default.find({
                memberId: memberId,
                blogs: {
                    $in: blog._id,
                },
            });
            if (blogCollections.length > 0) {
                blog.hasInCollection = true;
            }
            else {
                blog.hasInCollection = false;
            }
            returnBlogs.push(blog);
        }
        return returnBlogs;
    }
    async deleteAGeneralBlog(blogId) {
        await generalBlog_1.default.findOneAndDelete({ _id: blogId });
        return 'Successfully deleted general blog';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewGeneralBlog_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "addGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditGeneralBlog_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "editAGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => GeneralBlog_1.default),
    __param(0, (0, type_graphql_1.Arg)('blogId', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAgeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => GeneralBlog_1.default),
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __param(1, (0, type_graphql_1.Arg)('memberId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAgeneralBlogBySlug", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GeneralBlog_1.default]),
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAllGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GeneralBlog_1.default]),
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAllGeneralBlogForClient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('blogId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "deleteAGeneralBlog", null);
GeneralBlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GeneralBlogResolver);
exports.default = GeneralBlogResolver;
