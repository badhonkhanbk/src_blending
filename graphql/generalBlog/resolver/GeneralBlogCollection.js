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
const generalBlogCollection_1 = __importDefault(require("../../../models/generalBlogCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const BlogCollection_1 = __importDefault(require("../schema/blogCollection/BlogCollection"));
const AddNewBlogCollection_1 = __importDefault(require("./inputType/BlogCollection/AddNewBlogCollection"));
const BlogCollectionsWithDefaultCollection_1 = __importDefault(require("../schema/blogCollection/BlogCollectionsWithDefaultCollection"));
const GeneralBlogCollectionWithPagination_1 = __importDefault(require("../schema/GeneralBlogCollectionWithPagination"));
const blogComment_1 = __importDefault(require("../../../models/blogComment"));
const mongoose_1 = __importDefault(require("mongoose"));
const EditBlogCollection_1 = __importDefault(require("./inputType/BlogCollection/EditBlogCollection"));
let GeneralBlogCollectionResolver = class GeneralBlogCollectionResolver {
    async getAllBlogCollections(memberId) {
        let collections = await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
        if (collections.length === 0) {
            let defaultBlogCollection = await generalBlogCollection_1.default.create({
                name: 'My Favorite',
                slug: 'my-favorite',
                memberId: memberId,
                isDefault: true,
                collectionDataCount: 0,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedBlogCollection: defaultBlogCollection._id,
            });
            return {
                blogCollections: [defaultBlogCollection],
                defaultCollection: defaultBlogCollection,
            };
        }
        else {
            let member = await memberModel_1.default.findOne({
                _id: memberId,
            }).select('lastModifiedBlogCollection');
            let defaultBlogCollection = await generalBlogCollection_1.default.findOne({
                _id: member.lastModifiedBlogCollection,
            });
            return {
                blogCollections: collections,
                defaultCollection: defaultBlogCollection,
            };
        }
    }
    async addToLastModifiedBlogCollection(memberId, blogId) {
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedBlogCollection');
        if (!member.lastModifiedBlogCollection) {
            let defaultBlogCollection = await generalBlogCollection_1.default.create({
                name: 'My Favorite',
                slug: 'my-favorite',
                memberId: memberId,
                isDefault: true,
                blogs: [blogId],
                collectionDataCount: 1,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedBlogCollection: defaultBlogCollection._id,
            });
            return defaultBlogCollection;
        }
        let blogCollection = await generalBlogCollection_1.default.findOneAndUpdate({
            _id: member.lastModifiedBlogCollection,
            memberId: memberId,
        }, {
            $addToSet: {
                blogs: [blogId],
            },
            //collectionDataCount: collection.blogs.length + 1,
        }, {
            new: true,
        });
        let newBlogCollection = await generalBlogCollection_1.default.findOneAndUpdate({ _id: blogCollection._id }, { collectionDataCount: blogCollection.blogs.length }, { new: true });
        return newBlogCollection;
    }
    async addOrRemoveToBlogCollection(collectionIds, memberId, blogId) {
        let collections = await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
        for (let i = 0; i < collections.length; i++) {
            let collection = collections[i];
            let index = collectionIds.indexOf(String(collection._id));
            if (index !== -1) {
                let bc = await generalBlogCollection_1.default.findOneAndUpdate({
                    _id: collection._id,
                    memberId: memberId,
                }, {
                    $addToSet: {
                        blogs: [blogId],
                    },
                    //collectionDataCount: collection.blogs.length + 1,
                }, {
                    new: true,
                });
                await generalBlogCollection_1.default.findOneAndUpdate({ _id: collection._id }, { collectionDataCount: bc.blogs.length });
            }
            else {
                let bc = await generalBlogCollection_1.default.findOneAndUpdate({
                    _id: collection._id,
                    memberId: memberId,
                }, {
                    $pull: {
                        blogs: blogId,
                    },
                    //collectionDataCount: collection.blogs.length - 1,
                }, {
                    new: true,
                });
                await generalBlogCollection_1.default.findOneAndUpdate({ _id: collection._id }, { collectionDataCount: bc.blogs.length });
            }
        }
        if (collectionIds.length > 0) {
            await memberModel_1.default.findOneAndUpdate({ _id: memberId }, { lastModifiedBlogCollection: collectionIds[collectionIds.length - 1] });
        }
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedBlogCollection');
        let blogCollections = await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
        let defaultCollection = await generalBlogCollection_1.default.findOne({
            _id: member.lastModifiedBlogCollection,
        });
        return {
            blogCollections: blogCollections,
            defaultCollection: defaultCollection,
        };
    }
    async addNewBlogCollection(data) {
        let newBlogCollection = await generalBlogCollection_1.default.create(data);
        return newBlogCollection;
    }
    async editABlogCollection(data) {
        let blogCollection = await generalBlogCollection_1.default.findOneAndUpdate({
            _id: data.editId,
            memberId: data.memberId,
        }, data.editableObject, {
            new: true,
        });
        return blogCollection;
    }
    async deleteBlogCollection(collectionId, memberId) {
        let blogCollection = await generalBlogCollection_1.default.findOne({
            _id: collectionId,
            memberId: memberId,
        }).select('isDefault');
        if (blogCollection.isDefault) {
            return new AppError_1.default('Default collection cannot be deleted', 400);
        }
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedBlogCollection');
        if (String(member.lastModifiedBlogCollection) === collectionId) {
            let defaultCollection = await generalBlogCollection_1.default.findOne({
                memberId: memberId,
                isDefault: true,
            }).select('_id');
            await memberModel_1.default.findOneAndUpdate({ _id: memberId }, { lastModifiedBlogCollection: defaultCollection._id });
        }
        if (!blogCollection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await generalBlogCollection_1.default.findOneAndDelete({
            _id: collectionId,
        });
        let collections = await generalBlogCollection_1.default.find({
            memberId: memberId,
        });
        let memberData = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedBlogCollection');
        let defaultCollection = await generalBlogCollection_1.default.findOne({
            _id: memberData.lastModifiedBlogCollection,
        });
        return {
            blogCollections: collections,
            defaultCollection: defaultCollection,
        };
    }
    async getAllBlogsForACollection(memberId, collectionId, limit, page) {
        if (!limit) {
            limit = 12;
        }
        if (!page) {
            page = 1;
        }
        let collection = await generalBlogCollection_1.default.findOne({
            _id: collectionId,
        })
            .populate('blogs')
            .limit(limit)
            .skip((page - 1) * limit);
        let returnBlogs = [];
        let blogs = collection.blogs;
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
            if (blogCollections.length > 0) {
                blog.hasInCollection = true;
            }
            else {
                blog.hasInCollection = false;
            }
            returnBlogs.push(blog);
        }
        let coll = await generalBlogCollection_1.default.findOne({
            _id: collectionId,
        });
        return {
            blogs: returnBlogs,
            collectionInfo: coll,
            totalBlogs: coll.collectionDataCount,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => BlogCollectionsWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "getAllBlogCollections", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('blogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "addToLastModifiedBlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogCollectionsWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('collectionIds', (type) => [String])),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('blogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String,
        String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "addOrRemoveToBlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewBlogCollection_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "addNewBlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlogCollection_1.default]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "editABlogCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => BlogCollectionsWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "deleteBlogCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => GeneralBlogCollectionWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('collectionId')),
    __param(2, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String, Number, Number]),
    __metadata("design:returntype", Promise)
], GeneralBlogCollectionResolver.prototype, "getAllBlogsForACollection", null);
GeneralBlogCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GeneralBlogCollectionResolver);
exports.default = GeneralBlogCollectionResolver;
