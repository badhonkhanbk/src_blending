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
const CreateIngredientData_1 = __importDefault(require("./CreateIngredientData"));
let CreateRecipe = class CreateRecipe {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "mainEntityOfPage", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateRecipe.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ImageInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateRecipe.prototype, "servingSize", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateRecipe.prototype, "servings", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "datePublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "prepTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "cookTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "totalTime", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "recipeYield", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "recipeIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "recipeInstructions", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "recipeCuisines", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "author", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "recipeBlendCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "brandName", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "foodCategories", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreateIngredientData_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "url", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "favicon", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "adminId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "seoTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "seoSlug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "seoCanonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateRecipe.prototype, "seoSiteMapPriority", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateRecipe.prototype, "seoKeywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateRecipe.prototype, "seoMetaDescription", void 0);
CreateRecipe = __decorate([
    (0, type_graphql_1.InputType)()
], CreateRecipe);
exports.default = CreateRecipe;
