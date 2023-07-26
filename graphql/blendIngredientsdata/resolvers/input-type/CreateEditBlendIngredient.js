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
const BlendPortionInput_1 = __importDefault(require("./BlendPortionInput"));
let CreateEditBlendIngredient = class CreateEditBlendIngredient {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "varrient", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "blendNutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendPortionInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditBlendIngredient.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "defaultPortion", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendIngredient.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditBlendIngredient.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditBlendIngredient.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateEditBlendIngredient.prototype, "gi", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditBlendIngredient.prototype, "aliases", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateEditBlendIngredient.prototype, "rxScore", void 0);
CreateEditBlendIngredient = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditBlendIngredient);
exports.default = CreateEditBlendIngredient;
