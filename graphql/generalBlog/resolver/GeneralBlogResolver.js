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
const GlobalBookmarkLink_1 = __importDefault(require("../../../models/GlobalBookmarkLink"));
const BlogBookMarkAndExternalGlobalLink_1 = __importDefault(require("../schema/BlogBookMarkAndExternalGlobalLink"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const WikiLinks_1 = __importDefault(require("../../wiki/schemas/WikiLinks"));
let GeneralBlogResolver = class GeneralBlogResolver {
    async temo() {
        await generalBlog_1.default.updateMany({}, {
            bookmarkList: [],
        });
        return 'Done';
    }
    async addGeneralBlog(data) {
        let blog = await generalBlog_1.default.findOne({ slug: data.slug });
        if (blog) {
            return new AppError_1.default('Blog Slug already exist', 400);
        }
        let newBlog = {};
        if (data.publishDateString) {
            let isoDate = new Date(data.publishDateString).toISOString();
            newBlog = await generalBlog_1.default.create({
                ...data,
                publishDate: isoDate,
            });
            return newBlog;
        }
        newBlog = await generalBlog_1.default.create(data);
        return newBlog;
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
        let blog = await generalBlog_1.default.findOne({ _id: blogId }).populate('brand');
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
        blog.blogCollections = blogCollections;
        return blog;
    }
    async getAllGeneralBlog(currentDate, brand, category) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        let find = {};
        if (brand) {
            find.brand = brand;
        }
        if (category) {
            find.category = category;
        }
        let blogs = await generalBlog_1.default.find(find).populate('brand');
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
            }).select('_id');
            let collectionIds = blogCollections.map((bc) => bc._id);
            blog.blogCollections = collectionIds;
            returnBlogs.push(blog);
        }
        return returnBlogs;
    }
    async deleteAGeneralBlog(blogId) {
        await generalBlog_1.default.findOneAndDelete({ _id: blogId });
        return 'Successfully deleted general blog';
    }
    async getWikiLinksForBlog(blogId, links) {
        let blendNutrients = [];
        let blendIngredients = [];
        if (links) {
            blendNutrients = await blendNutrient_1.default.find({ isBookmarked: false })
                .lean()
                .select('_id nutrientName');
            blendIngredients = await blendIngredient_1.default.find()
                .select('wikiTitle _id ingredientName portions')
                .lean();
            // if()
        }
        let bookmarks = [];
        // let blogd = await GeneralBlogModel.find();
        // console.log(blogd);
        if (blogId) {
            let blog = await generalBlog_1.default.findOne({
                _id: blogId,
            }).select('_id bookmarkList');
            bookmarks = blog.bookmarkList;
        }
        // console.log(blog)
        let globalBookmarks = await GlobalBookmarkLink_1.default.find().populate({
            path: 'entityId',
            select: 'ingredientName nutrientName',
        });
        return {
            ingredientLinks: blendIngredients,
            nutrientLinks: blendNutrients,
            bookmarks: bookmarks,
            globalBookmarks: globalBookmarks,
        };
    }
    async manipulateBookMarksForBlog(blogId, link, customBookmarkName, removeCustomBookmark) {
        let blog = await generalBlog_1.default.findOne({ _id: blogId }).select('bookmarkList');
        // if (!(type === 'Nutrient') || !(type === 'Ingredient')) {801930
        //   return new AppError('Invalid type for bookmarks', 401);
        // }
        let found = blog.bookmarkList.filter(
        //@ts-ignore
        (bookmark) => bookmark.link === link)[0];
        if (found) {
            await generalBlog_1.default.findOneAndUpdate({ _id: blogId }, {
                $pull: {
                    //@ts-ignore
                    bookmarkList: { _id: found._id },
                },
            });
            if (!removeCustomBookmark) {
                await generalBlog_1.default.findOneAndUpdate({ _id: blogId }, {
                    $push: {
                        bookmarkList: {
                            customBookmarkName: found.customBookmarkName,
                            link: found.link,
                            active: false,
                        },
                    },
                });
            }
        }
        else {
            await generalBlog_1.default.findOneAndUpdate({ _id: blogId }, {
                $push: {
                    bookmarkList: {
                        customBookmarkName: customBookmarkName,
                        link: link,
                        active: true,
                    },
                },
            });
        }
        let externalBookmarks = await GlobalBookmarkLink_1.default.find().populate({
            path: 'entityId',
            select: 'ingredientName nutrientName',
        });
        // return 'done';
        let myBlog = await generalBlog_1.default.findOne({
            _id: blogId,
        }).select('_id bookmarkList');
        return {
            blogBookmarks: myBlog.bookmarkList,
            globalBookmarks: externalBookmarks,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "temo", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GeneralBlog_1.default),
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
    __param(1, (0, type_graphql_1.Arg)('brand', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('category', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String,
        String]),
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
__decorate([
    (0, type_graphql_1.Query)(() => WikiLinks_1.default),
    __param(0, (0, type_graphql_1.Arg)('blogId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('links', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getWikiLinksForBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogBookMarkAndExternalGlobalLink_1.default),
    __param(0, (0, type_graphql_1.Arg)('blogId')),
    __param(1, (0, type_graphql_1.Arg)('link')),
    __param(2, (0, type_graphql_1.Arg)('customBookmarkName')),
    __param(3, (0, type_graphql_1.Arg)('removeCustomBookmark', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "manipulateBookMarksForBlog", null);
GeneralBlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GeneralBlogResolver);
exports.default = GeneralBlogResolver;
