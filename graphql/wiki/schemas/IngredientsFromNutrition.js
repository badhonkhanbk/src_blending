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
const IngredientForWiki_1 = __importDefault(require("./IngredientForWiki"));
const Admin_1 = __importDefault(require("../../admin/resolvers/schemas/Admin"));
let IngredientFromNutrition = class IngredientFromNutrition {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "wikiTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "wikiDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], IngredientFromNutrition.prototype, "wikiCoverImages", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "wikiFeatureImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "bodies", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngredientForWiki_1.default], { nullable: true }),
    __metadata("design:type", Array)
], IngredientFromNutrition.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "publishedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], IngredientFromNutrition.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], IngredientFromNutrition.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], IngredientFromNutrition.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], IngredientFromNutrition.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], IngredientFromNutrition.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [Bookmark_1.default], { nullable: true }),
    __metadata("design:type", Array)
], IngredientFromNutrition.prototype, "nutrientBookmarkList", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Admin_1.default, { nullable: true }),
    __metadata("design:type", Admin_1.default)
], IngredientFromNutrition.prototype, "author", void 0);
IngredientFromNutrition = __decorate([
    (0, type_graphql_1.ObjectType)()
], IngredientFromNutrition);
exports.default = IngredientFromNutrition;
