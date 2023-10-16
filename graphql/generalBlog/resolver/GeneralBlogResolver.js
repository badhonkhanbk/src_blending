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
const FilterBlogInput_1 = __importDefault(require("./inputType/FilterBlogInput"));
const BlogsWithPagination_1 = __importDefault(require("../schema/BlogsWithPagination"));
const generalBlogCollection_2 = __importDefault(require("../../../models/generalBlogCollection"));
let GeneralBlogResolver = class GeneralBlogResolver {
    /**
     * A function that updates the bookmark list of all general blog models.
     *
     * @return {string} The string 'Done' indicating the completion of the update.
     */
    async temo() {
        await generalBlog_1.default.updateMany({}, {
            bookmarkList: [],
        });
        return 'Done';
    }
    /**
     * Adds a new general blog to the database.
     *
     * @param {CreateNewGeneralBlog} data - The data of the new general blog.
     * @returns {Promise<any>} The newly created general blog.
     */
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
    /**
     * Edits a general blog.
     *
     * @param {EditGeneralBlog} data - the data for editing the blog
     * @return {Promise<string>} - a promise that resolves to a success message
     */
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
    /**
     * Retrieves a general blog by its ID and the current date.
     *
     * @param {ID} blogId - The ID of the blog.
     * @param {string} currentDate - The current date.
     * @return {any} The fetched blog.
     */
    async getAgeneralBlog(blogId, currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        // await GeneralBlogModel.updateMany(
        //   {
        //     publishDate: {
        //       $lte: today,
        //     },
        //     isPublished: false,
        //   },
        //   { isPublished: true }
        // );
        let blog = await generalBlog_1.default.findOne({ _id: blogId })
            .populate('brand')
            .populate('createdBy');
        return blog;
    }
    /**
     * Retrieves a general blog by its slug.
     *
     * @param {string} slug - The slug of the blog.
     * @param {string} memberId - The ID of the member. (nullable)
     * @return {any} The retrieved blog object.
     */
    async getAgeneralBlogBySlug(slug, memberId) {
        let blog = await generalBlog_1.default.findOne({ slug: slug })
            .populate('brand')
            .populate('createdBy');
        blog.commentsCount = await blogComment_1.default.countDocuments({
            blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
        });
        blog.commentsCount = await blogComment_1.default.countDocuments({
            blogId: new mongoose_1.default.mongo.ObjectId(blog._id),
        });
        if (memberId) {
            let blogCollections = await generalBlogCollection_1.default.find({
                memberId: memberId,
                blogs: {
                    $in: blog._id,
                },
            }).select('_id');
            blog.blogCollections = blogCollections;
        }
        return blog;
    }
    /**
     * Retrieves all general blog articles based on the specified filters.
     *
     * @param {string} currentDate - The current date in ISO format (YYYY-MM-DD).
     * @param {String} brand - The brand to filter by (optional).
     * @param {String} category - The category to filter by (optional).
     * @return {Array} An array of blog articles that match the filters.
     */
    async getAllGeneralBlog(currentDate, brand, category, withPublished) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        // await GeneralBlogModel.updateMany(
        //   {
        //     publishDate: {
        //       $lte: today,
        //     },
        //     isPublished: false,
        //   },
        //   { isPublished: true }
        // );
        let find = {};
        if (brand) {
            find.brand = brand;
        }
        if (category) {
            find.category = category;
        }
        if (withPublished) {
            find.publishDate = { $lte: today };
            find.isPublished = true;
        }
        let blogs = await generalBlog_1.default.find(find)
            .populate('brand')
            .populate('createdBy');
        return blogs;
    }
    /**
     * Retrieves all general blogs for a client.
     *
     * @param {string} currentDate - The current date in string format.
     * @param {String} memberId - The ID of the member.
     * @return {any[]} An array of general blog objects.
     */
    async getAllGeneralBlogForClient(currentDate, memberId, page, limit) {
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        let blogs = await generalBlog_1.default.find({ isPublished: true })
            .lean()
            .populate('brand')
            .populate('createdBy')
            .limit(limit)
            .skip((page - 1) * limit);
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
        return {
            blogs: returnBlogs,
            totalBlogs: await generalBlog_1.default.countDocuments({ isPublished: true }),
        };
    }
    /**
     * Deletes a general blog.
     *
     * @param {string} blogId - The ID of the blog to be deleted.
     * @return {Promise<string>} - A promise that resolves to a success message.
     */
    async deleteAGeneralBlog(blogId) {
        await generalBlog_1.default.findOneAndDelete({ _id: blogId });
        return 'Successfully deleted general blog';
    }
    /**
     * Retrieves the wiki links for a given blog.
     *
     * @param {String} blogId - The ID of the blog (optional)
     * @param {Boolean} links - Whether to include links or not (optional)
     * @return {Object} - An object containing the retrieved links and bookmarks
     */
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
    /**
     * Manipulates book marks for a blog.
     *
     * @param {String} blogId - the ID of the blog
     * @param {String} link - the link of the bookmark
     * @param {String} customBookmarkName - the name of the custom bookmark
     * @param {Boolean} removeCustomBookmark - whether to remove the custom bookmark (optional)
     * @return {Object} an object containing the blog bookmarks and global bookmarks
     */
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
    async filterBlog(data, page, limit, memberId, currentDate) {
        let today = new Date(new Date(currentDate).toISOString().slice(0, 10));
        await generalBlog_1.default.updateMany({
            publishDate: {
                $lte: today,
            },
            isPublished: false,
        }, { isPublished: true });
        if (!limit) {
            limit = 20;
        }
        if (!page) {
            page = 1;
        }
        let filter = {};
        let collectionBlogIds = [];
        let blogIds = [];
        let hasCollection = false;
        let hasPublisher = false;
        if (data.collections && data.collections.length > 0) {
            hasCollection = true;
            let blogCollections = await generalBlogCollection_2.default.find({
                memberId: memberId,
                _id: { $in: data.collections },
            }).select('blogs');
            for (let i = 0; i < blogCollections.length; i++) {
                collectionBlogIds = collectionBlogIds.concat(blogCollections[i].blogs);
            }
        }
        if (data.publishers && data.publishers.length > 0) {
            hasPublisher = true;
            let publisherFilter = {};
            if (collectionBlogIds.length > 0) {
                publisherFilter._id = { $in: collectionBlogIds };
            }
            for (let i = 0; i < data.publishers.length; i++) {
                publisherFilter.publisher = data.publishers[i].publisher;
                if (data.publishers[i].categories.length > 0) {
                    publisherFilter.category = { $in: data.publishers[i].categories };
                }
                let blogs = await generalBlog_1.default.find(publisherFilter).select('_id');
                let ids = blogs.map((blog) => blog._id);
                blogIds = blogIds.concat(ids);
            }
        }
        else {
            if (collectionBlogIds.length > 0) {
                blogIds = collectionBlogIds;
            }
            {
                filter.publisher = { $in: ['poily', 'blending101', 'plantMilkmakers'] };
            }
        }
        if (blogIds.length > 0) {
            filter._id = { $in: blogIds };
        }
        if (hasCollection && hasPublisher && blogIds.length === 0) {
            return {
                blogs: [],
                totalBlogs: 0,
            };
        }
        if (hasCollection && blogIds.length === 0) {
            return {
                blogs: [],
                totalBlogs: 0,
            };
        }
        if (hasPublisher && blogIds.length === 0) {
            return {
                blogs: [],
                totalBlogs: 0,
            };
        }
        // if (blogIds.length > 0) {
        //   filter._id = { $in: blogIds };
        // } else if (blogIds.length === 0 && collectionBlogIds.length > 0) {
        //   filter._id = { $in: collectionBlogIds };
        // }
        if (data.author && data.author.length > 0) {
            filter.createdBy = { $in: data.author };
        }
        filter.isPublished = true;
        filter.publishDate = { $lte: today };
        if (data.searchTerm) {
            filter.title = { $regex: data.searchTerm, $options: 'i' };
        }
        let blogs = await generalBlog_1.default.find(filter)
            .lean()
            .populate('brand')
            .populate('createdBy')
            .limit(limit)
            .skip((page - 1) * limit);
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
        return {
            blogs: returnBlogs,
            totalBlogs: await generalBlog_1.default.countDocuments(filter),
        };
    }
    async manus() {
        await generalBlog_1.default.updateMany({}, { publisher: 'poily' });
        return 1;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * A function that updates the bookmark list of all general blog models.
     *
     * @return {string} The string 'Done' indicating the completion of the update.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "temo", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => GeneralBlog_1.default)
    /**
     * Adds a new general blog to the database.
     *
     * @param {CreateNewGeneralBlog} data - The data of the new general blog.
     * @returns {Promise<any>} The newly created general blog.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewGeneralBlog_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "addGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Edits a general blog.
     *
     * @param {EditGeneralBlog} data - the data for editing the blog
     * @return {Promise<string>} - a promise that resolves to a success message
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditGeneralBlog_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "editAGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => GeneralBlog_1.default)
    /**
     * Retrieves a general blog by its ID and the current date.
     *
     * @param {ID} blogId - The ID of the blog.
     * @param {string} currentDate - The current date.
     * @return {any} The fetched blog.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('blogId', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAgeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => GeneralBlog_1.default)
    /**
     * Retrieves a general blog by its slug.
     *
     * @param {string} slug - The slug of the blog.
     * @param {string} memberId - The ID of the member. (nullable)
     * @return {any} The retrieved blog object.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('slug')),
    __param(1, (0, type_graphql_1.Arg)('memberId', (type) => type_graphql_1.ID, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAgeneralBlogBySlug", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GeneralBlog_1.default])
    /**
     * Retrieves all general blog articles based on the specified filters.
     *
     * @param {string} currentDate - The current date in ISO format (YYYY-MM-DD).
     * @param {String} brand - The brand to filter by (optional).
     * @param {String} category - The category to filter by (optional).
     * @return {Array} An array of blog articles that match the filters.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __param(1, (0, type_graphql_1.Arg)('brand', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('category', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('withPublished', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAllGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlogsWithPagination_1.default)
    /**
     * Retrieves all general blogs for a client.
     *
     * @param {string} currentDate - The current date in string format.
     * @param {String} memberId - The ID of the member.
     * @return {any[]} An array of general blog objects.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('currentDate')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Number, Number]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getAllGeneralBlogForClient", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Deletes a general blog.
     *
     * @param {string} blogId - The ID of the blog to be deleted.
     * @return {Promise<string>} - A promise that resolves to a success message.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('blogId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "deleteAGeneralBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => WikiLinks_1.default)
    /**
     * Retrieves the wiki links for a given blog.
     *
     * @param {String} blogId - The ID of the blog (optional)
     * @param {Boolean} links - Whether to include links or not (optional)
     * @return {Object} - An object containing the retrieved links and bookmarks
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('blogId', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('links', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "getWikiLinksForBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogBookMarkAndExternalGlobalLink_1.default)
    /**
     * Manipulates book marks for a blog.
     *
     * @param {String} blogId - the ID of the blog
     * @param {String} link - the link of the bookmark
     * @param {String} customBookmarkName - the name of the custom bookmark
     * @param {Boolean} removeCustomBookmark - whether to remove the custom bookmark (optional)
     * @return {Object} an object containing the blog bookmarks and global bookmarks
     */
    ,
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
__decorate([
    (0, type_graphql_1.Query)(() => BlogsWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __param(1, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('memberId')),
    __param(4, (0, type_graphql_1.Arg)('currentDate')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [FilterBlogInput_1.default, Number, Number, String, String]),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "filterBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Number),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GeneralBlogResolver.prototype, "manus", null);
GeneralBlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GeneralBlogResolver);
exports.default = GeneralBlogResolver;
