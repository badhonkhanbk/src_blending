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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const Bookmark_1 = __importDefault(require("./Bookmark"));
const Admin_1 = __importDefault(require("../../admin/resolvers/schemas/Admin"));
const WikiListWithPagination_1 = __importDefault(require("./WikiListWithPagination"));
const IngreidntHealthType_1 = __importDefault(require("../../health/schema/IngreidntHealthType"));
const NutrientHealthType_1 = __importDefault(require("../../health/schema/NutrientHealthType"));
let HealthWiki = class HealthWiki {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], HealthWiki.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "wikiTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "wikiDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], HealthWiki.prototype, "wikiCoverImages", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "wikiFeatureImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "bodies", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "publishedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HealthWiki.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], HealthWiki.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthWiki.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], HealthWiki.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HealthWiki.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [Bookmark_1.default], { nullable: true }),
    __metadata("design:type", Array)
], HealthWiki.prototype, "nutrientBookmarkList", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Admin_1.default, { nullable: true }),
    __metadata("design:type", Admin_1.default)
], HealthWiki.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngreidntHealthType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], HealthWiki.prototype, "foods", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrientHealthType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], HealthWiki.prototype, "nutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => WikiListWithPagination_1.default),
    __metadata("design:type", WikiListWithPagination_1.default)
], HealthWiki.prototype, "relatedWikis", void 0);
HealthWiki = __decorate([
    (0, type_graphql_1.ObjectType)()
], HealthWiki);
exports.default = HealthWiki;
