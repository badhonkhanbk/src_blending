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
const IngredientData_1 = __importDefault(require("../../recipe/schemas/IngredientData"));
const RecipeCategory_1 = __importDefault(require("../../recipe/schemas/RecipeCategory"));
let ChallengePost = class ChallengePost {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ChallengePost.prototype, "docId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ChallengePost.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RecipeCategory_1.default),
    __metadata("design:type", RecipeCategory_1.default)
], ChallengePost.prototype, "recipeBlendCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String]),
    __metadata("design:type", Array)
], ChallengePost.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ChallengePost.prototype, "servingSize", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ChallengePost.prototype, "servings", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ChallengePost.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ChallengePost.prototype, "note", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngredientData_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ChallengePost.prototype, "ingredients", void 0);
ChallengePost = __decorate([
    (0, type_graphql_1.ObjectType)()
], ChallengePost);
exports.default = ChallengePost;
