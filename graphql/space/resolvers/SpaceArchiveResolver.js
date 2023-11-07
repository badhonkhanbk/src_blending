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
const spaceArchive_1 = __importDefault(require("../../../models/spaceArchive"));
const CreateNewSpaceArchive_1 = __importDefault(require("./input-type/spaceArchive/CreateNewSpaceArchive"));
const SimpleSpaceArchive_1 = __importDefault(require("../schema/spaceArchive/SimpleSpaceArchive"));
const populatedSpaceArchive_1 = __importDefault(require("../schema/spaceArchive/populatedSpaceArchive"));
const mongoose_1 = __importDefault(require("mongoose"));
// import CreateNewSpaceBlog from './input-type/spaceBlog/CreateNewSpaceBlog';
// import SpaceBlogModel from '../../../models/SpaceBlog';
// import EditSpaceBlog from './input-type/spaceBlog/EditSPaceBlog';
// import SpaceBlog from '../schema/spaceBlog/SpaceBlog';
// import slugify from 'slugify';
let SpaceBlogResolver = class SpaceBlogResolver {
    async createNewSpaceArchive(data) {
        let spaceArchive = await spaceArchive_1.default.create(data);
        if (spaceArchive) {
            let spaceArchivePopulated = await spaceArchive_1.default.findOne({
                _id: spaceArchive._id,
            });
            return spaceArchivePopulated;
        }
        else {
            return new AppError_1.default('Something went wrong', 500);
        }
    }
    async addNewBlogToSpaceArchive(archiveId, spaceBlogId) {
        let spaceArchive = await spaceArchive_1.default.findOne({ _id: archiveId });
        if (!spaceArchive) {
            return new AppError_1.default('space archive not found', 404);
        }
        await spaceArchive_1.default.findOneAndUpdate({ _id: archiveId }, { $addToSet: { spaceBlogs: spaceBlogId } });
        let newSpaceArchive = await spaceArchive_1.default.findOne({
            _id: archiveId,
        }).select('spaceBlogs');
        await spaceArchive_1.default.findOneAndUpdate({
            _id: archiveId,
        }, {
            blogsCount: newSpaceArchive.spaceBlogs.length,
        });
        return 'success';
    }
    async getAllSpaceArchives(spaceId) {
        let spaceArchives = await spaceArchive_1.default.find({ spaceId: spaceId });
        return spaceArchives;
    }
    async getASpaceArchiveById(spaceArchiveId) {
        let spaceArchive = await spaceArchive_1.default.findById(spaceArchiveId)
            .populate('spaceId')
            .populate('createdBy')
            .populate('spaceBlogs');
        if (!spaceArchive) {
            return new AppError_1.default('space archive not found', 404);
        }
        return spaceArchive;
    }
    async addOrRemoveBlogsToASpaceArchive(archiveId, spaceBlogIds) {
        // check if the blog is already in the list of archived blogs for this space archive
        const spaceArchive = await spaceArchive_1.default.findById(archiveId);
        if (!spaceArchive) {
            return new AppError_1.default('space archive not found', 404);
        }
        for (let i = 0; i < spaceBlogIds.length; i++) {
            let isInArchive = spaceArchive.spaceBlogs.includes(new mongoose_1.default.mongo.ObjectId(spaceBlogIds[i].toString()));
            if (isInArchive) {
                await spaceArchive_1.default.findOneAndUpdate({ _id: archiveId }, { $pull: { spaceBlogs: spaceBlogIds[i] } });
            }
            else {
                await spaceArchive_1.default.findOneAndUpdate({ _id: archiveId }, { $addToSet: { spaceBlogs: spaceBlogIds[i] } });
            }
        }
        let newSpaceArchive = await spaceArchive_1.default.findOne({
            _id: archiveId,
        }).select('spaceBlogs');
        await spaceArchive_1.default.findOneAndUpdate({
            _id: archiveId,
        }, {
            blogsCount: newSpaceArchive.spaceBlogs.length,
        });
        return 'done';
    }
    async deleteSpaceArchive(archiveId) {
        let spaceArchive = await spaceArchive_1.default.findById(archiveId);
        if (!spaceArchive) {
            return new AppError_1.default('space archive not found', 404);
        }
        await spaceArchive.remove();
        return 'done';
    }
    async editSpaceArchiveNameOrIcon(archiveName, icon, archiveId) {
        let spaceArchive = await spaceArchive_1.default.findById(archiveId);
        if (!spaceArchive) {
            return new AppError_1.default('space archive not found', 404);
        }
        if (archiveName) {
            await spaceArchive_1.default.findOneAndUpdate({
                _id: archiveId,
            }, {
                archiveName,
            });
        }
        if (icon) {
            await spaceArchive_1.default.findOneAndUpdate({
                _id: archiveId,
            }, {
                icon,
            });
        }
        let newSpaceArchive = await spaceArchive_1.default.findOne({ _id: archiveId });
        return newSpaceArchive;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SimpleSpaceArchive_1.default),
    __param(0, (0, type_graphql_1.Arg)('spaceArchiveData', (type) => CreateNewSpaceArchive_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewSpaceArchive_1.default]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "createNewSpaceArchive", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('archiveId')),
    __param(1, (0, type_graphql_1.Arg)('spaceBlogId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "addNewBlogToSpaceArchive", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleSpaceArchive_1.default]),
    __param(0, (0, type_graphql_1.Arg)('spaceId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "getAllSpaceArchives", null);
__decorate([
    (0, type_graphql_1.Query)(() => populatedSpaceArchive_1.default),
    __param(0, (0, type_graphql_1.Arg)('spaceArchiveId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "getASpaceArchiveById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('archiveId')),
    __param(1, (0, type_graphql_1.Arg)('spaceBlogIds', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "addOrRemoveBlogsToASpaceArchive", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('archiveId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "deleteSpaceArchive", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SimpleSpaceArchive_1.default),
    __param(0, (0, type_graphql_1.Arg)('archiveName', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('icon', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('archiveId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "editSpaceArchiveNameOrIcon", null);
SpaceBlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceBlogResolver);
exports.default = SpaceBlogResolver;
