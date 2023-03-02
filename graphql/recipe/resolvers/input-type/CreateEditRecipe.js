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
const ImageInput_1 = __importDefault(require("./ImageInput"));
let CreateEditRecipe = class CreateEditRecipe {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "mainEntityOfPage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateEditRecipe.prototype, "servings", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ImageInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipe.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "datePublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "prepTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "cookTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "totalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "recipeYield", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipe.prototype, "recipeCuisines", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipe.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "recipeBlendCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipe.prototype, "foodCategories", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "url", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "favicon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateEditRecipe.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipe.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipe.prototype, "seoMetaDescription", void 0);
CreateEditRecipe = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditRecipe);
exports.default = CreateEditRecipe;
