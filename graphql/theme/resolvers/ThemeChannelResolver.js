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
const themeChannel_1 = __importDefault(require("../../../models/themeChannel"));
const ThemeChannel_1 = __importDefault(require("../schemas/ThemeChannel"));
let ThemeChannelResolver = class ThemeChannelResolver {
    async addThemeChannel(name, description) {
        await themeChannel_1.default.create({
            name,
            description,
        });
        return 'theme channel created';
    }
    async getAllThemeChannels() {
        return await themeChannel_1.default.find();
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('name')),
    __param(1, (0, type_graphql_1.Arg)('description')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ThemeChannelResolver.prototype, "addThemeChannel", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ThemeChannel_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ThemeChannelResolver.prototype, "getAllThemeChannels", null);
ThemeChannelResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ThemeChannelResolver);
exports.default = ThemeChannelResolver;
