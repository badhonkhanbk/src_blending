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
const SimpleRecipe_1 = __importDefault(require("./SimpleRecipe"));
const SimpleVersion_1 = __importDefault(require("./SimpleVersion"));
let ProfileRecipe = class ProfileRecipe {
};
__decorate([
    (0, type_graphql_1.Field)((type) => SimpleRecipe_1.default, { nullable: true }),
    __metadata("design:type", SimpleRecipe_1.default)
], ProfileRecipe.prototype, "recipeId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => SimpleVersion_1.default, { nullable: true }),
    __metadata("design:type", SimpleVersion_1.default)
], ProfileRecipe.prototype, "defaultVersion", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], ProfileRecipe.prototype, "isMatch", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], ProfileRecipe.prototype, "allRecipes", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], ProfileRecipe.prototype, "myRecipes", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], ProfileRecipe.prototype, "tags", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ProfileRecipe.prototype, "notes", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], ProfileRecipe.prototype, "addedToCompare", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], ProfileRecipe.prototype, "userCollections", void 0);
ProfileRecipe = __decorate([
    (0, type_graphql_1.ObjectType)()
], ProfileRecipe);
exports.default = ProfileRecipe;
