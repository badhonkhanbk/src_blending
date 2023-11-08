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
const BlendPortion_1 = __importDefault(require("../../blendIngredientsdata/schemas/BlendPortion"));
const Bookmark_1 = __importDefault(require("./Bookmark"));
const Admin_1 = __importDefault(require("../../admin/resolvers/schemas/Admin"));
const WikiListWithPagination_1 = __importDefault(require("./WikiListWithPagination"));
const HealthImpact_1 = __importDefault(require("./HealthImpact"));
let NutritionFromIngredient = class NutritionFromIngredient {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "wikiTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "wikiDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], NutritionFromIngredient.prototype, "wikiCoverImages", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "wikiFeatureImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "bodies", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "publishedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [BlendPortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], NutritionFromIngredient.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], NutritionFromIngredient.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], NutritionFromIngredient.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], NutritionFromIngredient.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], NutritionFromIngredient.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], NutritionFromIngredient.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], NutritionFromIngredient.prototype, "hasInCompare", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [Bookmark_1.default], { nullable: true }),
    __metadata("design:type", Array)
], NutritionFromIngredient.prototype, "ingredientBookmarkList", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Admin_1.default, { nullable: true }),
    __metadata("design:type", Admin_1.default)
], NutritionFromIngredient.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => WikiListWithPagination_1.default),
    __metadata("design:type", WikiListWithPagination_1.default)
], NutritionFromIngredient.prototype, "relatedWikis", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [HealthImpact_1.default], { nullable: true }),
    __metadata("design:type", Array)
], NutritionFromIngredient.prototype, "healthImpacts", void 0);
NutritionFromIngredient = __decorate([
    (0, type_graphql_1.ObjectType)()
], NutritionFromIngredient);
exports.default = NutritionFromIngredient;
