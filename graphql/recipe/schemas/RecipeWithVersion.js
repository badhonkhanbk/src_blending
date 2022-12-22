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
const RecipeCategory_1 = __importDefault(require("./RecipeCategory"));
const Brand_1 = __importDefault(require("./Brand"));
const ImageType_1 = __importDefault(require("./ImageType"));
const IngredientData_1 = __importDefault(require("./IngredientData"));
const RecipeVersion_1 = __importDefault(require("./RecipeVersion"));
const MemberProfileForRecipe_1 = __importDefault(require("./MemberProfileForRecipe"));
let RecipeWithVersion = class RecipeWithVersion {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "mainEntityOfPage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ImageType_1.default], {
        nullable: true,
    }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "servingSize", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "servings", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "datePublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "prepTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "cookTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "totalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "recipeYield", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "recipeIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "recipeInstructions", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "recipeCuisines", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RecipeCategory_1.default, { nullable: true }),
    __metadata("design:type", RecipeCategory_1.default)
], RecipeWithVersion.prototype, "recipeBlendCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Brand_1.default, { nullable: true }),
    __metadata("design:type", Brand_1.default)
], RecipeWithVersion.prototype, "brand", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "foodCategories", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngredientData_1.default], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "url", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RecipeWithVersion.prototype, "scrappedByAdmin", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RecipeWithVersion.prototype, "discovery", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "favicon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "numberOfRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "totalRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "totalViews", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "averageRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeWithVersion.prototype, "seoMetaDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeWithVersion.prototype, "notes", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => MemberProfileForRecipe_1.default, { nullable: true }),
    __metadata("design:type", MemberProfileForRecipe_1.default)
], RecipeWithVersion.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RecipeWithVersion.prototype, "addedToCompare", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "userCollections", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [RecipeVersion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], RecipeWithVersion.prototype, "recipeVersion", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], RecipeWithVersion.prototype, "isMatch", void 0);
RecipeWithVersion = __decorate([
    (0, type_graphql_1.ObjectType)()
], RecipeWithVersion);
exports.default = RecipeWithVersion;
