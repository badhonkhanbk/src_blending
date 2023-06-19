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
const theme_1 = __importDefault(require("../../../models/theme"));
const Theme_1 = __importDefault(require("../schemas/Theme"));
const EditTheme_1 = __importDefault(require("./input-type/EditTheme"));
const themeInput_1 = __importDefault(require("./input-type/themeInput"));
let ThemeResolver = class ThemeResolver {
    async createNewTheme(data) {
        let theme = await theme_1.default.create(data);
        return theme._id;
    }
    async editATheme(data) {
        let theme = await theme_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        //@ts-ignore
        theme.updatedAt = Date.now();
        theme.save();
        return 'successfully edited';
    }
    async removeATheme(themeId) {
        await theme_1.default.findByIdAndDelete(themeId);
        return 'theme removed successfully';
    }
    async getASingleTheme(themeId) {
        let theme = await theme_1.default.findOne({ _id: themeId });
        return theme;
    }
    async getAllThemes(domain) {
        if (!domain) {
            let themes = await theme_1.default.find().sort({ createdAt: -1 });
            return themes;
        }
        else {
            let themes = await theme_1.default.find({ domain: domain }).sort({
                createdAt: -1,
            });
            return themes;
        }
    }
    async removeAllThemes() {
        await theme_1.default.deleteMany();
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [themeInput_1.default]),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "createNewTheme", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditTheme_1.default]),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "editATheme", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "removeATheme", null);
__decorate([
    (0, type_graphql_1.Query)(() => Theme_1.default),
    __param(0, (0, type_graphql_1.Arg)('themeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "getASingleTheme", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Theme_1.default]),
    __param(0, (0, type_graphql_1.Arg)('domain', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "getAllThemes", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemeResolver.prototype, "removeAllThemes", null);
ThemeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ThemeResolver);
exports.default = ThemeResolver;
