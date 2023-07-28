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
const CreatePortion_1 = __importDefault(require("../../../src_food/resolvers/input-type/CreatePortion"));
const addBlendNutrientToIBlendIngredient_1 = __importDefault(require("./addBlendNutrientToIBlendIngredient"));
let AddNewBlendIngredient = class AddNewBlendIngredient {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "varrient", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [addBlendNutrientToIBlendIngredient_1.default], { nullable: true }),
    __metadata("design:type", addBlendNutrientToIBlendIngredient_1.default)
], AddNewBlendIngredient.prototype, "blendNutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreatePortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], AddNewBlendIngredient.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], AddNewBlendIngredient.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], AddNewBlendIngredient.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], AddNewBlendIngredient.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AddNewBlendIngredient.prototype, "gi", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AddNewBlendIngredient.prototype, "rxScore", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AddNewBlendIngredient.prototype, "gl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], AddNewBlendIngredient.prototype, "netCarbs", void 0);
AddNewBlendIngredient = __decorate([
    (0, type_graphql_1.InputType)()
], AddNewBlendIngredient);
exports.default = AddNewBlendIngredient;
