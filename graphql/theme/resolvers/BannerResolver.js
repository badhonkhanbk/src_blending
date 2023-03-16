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
const banner_1 = __importDefault(require("../../../models/banner"));
const Banner_1 = __importDefault(require("../schemas/Banner"));
const EditBanner_1 = __importDefault(require("./input-type/EditBanner"));
const BannerInput_1 = __importDefault(require("./input-type/BannerInput"));
const newModel_1 = __importDefault(require("../../../models/newModel"));
let BannerResolver = class BannerResolver {
    async createNewBanner(data) {
        let theme = await banner_1.default.create(data);
        return theme._id;
    }
    async editABanner(data) {
        let theme = await banner_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        //@ts-ignore
        theme.updatedAt = Date.now();
        theme.save();
        return 'successfully edited';
    }
    async removeABanner(themeId) {
        await banner_1.default.findByIdAndDelete(themeId);
        return 'theme removed successfully';
    }
    async getASingleBanner(themeId) {
        let theme = await banner_1.default.findOne({ _id: themeId });
        return theme;
    }
    async getAllBanners() {
        let themes = await banner_1.default.find().sort({ createdAt: -1 });
        return themes;
    }
    async removeAllBanners() {
        await banner_1.default.deleteMany();
        return 'done';
    }
    async getBannerCount() {
        console.log(JSON.stringify(newModel_1.default.obj));
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [BannerInput_1.default]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "createNewBanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBanner_1.default]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "editABanner", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('bannerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "removeABanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => Banner_1.default),
    __param(0, (0, type_graphql_1.Arg)('bannerId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getASingleBanner", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Banner_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getAllBanners", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "removeAllBanners", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BannerResolver.prototype, "getBannerCount", null);
BannerResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BannerResolver);
exports.default = BannerResolver;
