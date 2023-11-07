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
const CreateNewSpaceBlog_1 = __importDefault(require("./input-type/spaceBlog/CreateNewSpaceBlog"));
const SpaceBlog_1 = __importDefault(require("../../../models/SpaceBlog"));
const EditSPaceBlog_1 = __importDefault(require("./input-type/spaceBlog/EditSPaceBlog"));
const SpaceBlog_2 = __importDefault(require("../schema/spaceBlog/SpaceBlog"));
let SpaceBlogResolver = class SpaceBlogResolver {
    async createNewSpaceBlog(data) {
        let spaceBlog = await SpaceBlog_1.default.create(data);
        if (spaceBlog) {
            let spaceBlogPopulated = await SpaceBlog_1.default.findOne({
                _id: spaceBlog._id,
            })
                .populate('spaceId')
                .populate('author');
            return spaceBlogPopulated;
        }
        else {
            return new AppError_1.default('Something went wrong', 500);
        }
    }
    async getAllSpaceBlogs(spaceId) {
        let spaceBlogs = await SpaceBlog_1.default.find({ spaceId: spaceId })
            .populate('author')
            .populate('spaceId');
        return spaceBlogs;
    }
    async getASpaceBlogById(spaceBlogId) {
        let spaceBlog = await SpaceBlog_1.default.findById(spaceBlogId)
            .populate('author')
            .populate('spaceId');
        if (!spaceBlog) {
            return new AppError_1.default('space Blog not found', 404);
        }
        return spaceBlog;
    }
    async deleteSpaceBlog(spaceBlogId) {
        let spaceBlog = await SpaceBlog_1.default.findById(spaceBlogId);
        if (!spaceBlog) {
            return new AppError_1.default('space blog not found', 404);
        }
        await spaceBlog.remove();
        return 'done';
    }
    async editASpaceBlog(data) {
        let modifiedData = data.editableObject;
        // if (data.editableObject.title) {
        //   modifiedData.slug = slugify(data.editableObject.title.toLowerCase());
        // }
        await SpaceBlog_1.default.findOneAndUpdate({ _id: data.editId }, modifiedData);
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SpaceBlog_2.default),
    __param(0, (0, type_graphql_1.Arg)('spaceBlogData', (type) => CreateNewSpaceBlog_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewSpaceBlog_1.default]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "createNewSpaceBlog", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SpaceBlog_2.default]),
    __param(0, (0, type_graphql_1.Arg)('spaceId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "getAllSpaceBlogs", null);
__decorate([
    (0, type_graphql_1.Query)(() => SpaceBlog_2.default),
    __param(0, (0, type_graphql_1.Arg)('spaceBlogId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "getASpaceBlogById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('spaceBlogId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "deleteSpaceBlog", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('EditSpaceBlog')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditSPaceBlog_1.default]),
    __metadata("design:returntype", Promise)
], SpaceBlogResolver.prototype, "editASpaceBlog", null);
SpaceBlogResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceBlogResolver);
exports.default = SpaceBlogResolver;
