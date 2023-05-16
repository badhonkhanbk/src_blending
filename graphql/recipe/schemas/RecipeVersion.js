"use strict";
// name: String, quantiy: Number, default: Boolean, gram: Number
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
const IngredientData_1 = __importDefault(require("./IngredientData"));
const MemberProfileForRecipe_1 = __importDefault(require("./MemberProfileForRecipe"));
const GIGl_1 = __importDefault(require("../../blendIngredientsdata/schemas/GIGl"));
const CalorieInfo_1 = __importDefault(require("./CalorieInfo"));
const ErrorIngredient_1 = __importDefault(require("../../blendIngredientsdata/schemas/ErrorIngredient"));
//_id postfixTitle description
let RecipeVersion = class RecipeVersion {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], RecipeVersion.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], RecipeVersion.prototype, "servingSize", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], RecipeVersion.prototype, "recipeId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeVersion.prototype, "selectedImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], RecipeVersion.prototype, "recipeInstructions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeVersion.prototype, "postfixTitle", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], RecipeVersion.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngredientData_1.default], { nullable: true }),
    __metadata("design:type", Array)
], RecipeVersion.prototype, "ingredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", MemberProfileForRecipe_1.default)
], RecipeVersion.prototype, "createdBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => CalorieInfo_1.default, { nullable: true }),
    __metadata("design:type", CalorieInfo_1.default)
], RecipeVersion.prototype, "calorie", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", GIGl_1.default)
], RecipeVersion.prototype, "gigl", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ErrorIngredient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], RecipeVersion.prototype, "errorIngredients", void 0);
RecipeVersion = __decorate([
    (0, type_graphql_1.ObjectType)()
], RecipeVersion);
exports.default = RecipeVersion;
