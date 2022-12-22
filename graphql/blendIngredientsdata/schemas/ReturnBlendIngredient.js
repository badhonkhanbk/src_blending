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
const BlendPortion_1 = __importDefault(require("./BlendPortion"));
const BlendIngredientData_1 = __importDefault(require("./BlendIngredientData"));
let ReturnBlendIngredientData = class ReturnBlendIngredientData {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "srcFoodReference", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ReturnBlendIngredientData.prototype, "nutrientCount", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => BlendIngredientData_1.default, { nullable: true }),
    __metadata("design:type", BlendIngredientData_1.default)
], ReturnBlendIngredientData.prototype, "varrient", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ReturnBlendIngredientData.prototype, "notBlendNutrientCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ReturnBlendIngredientData.prototype, "imageCount", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendPortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientData.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientData.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientData.prototype, "sourceName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientData.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ReturnBlendIngredientData.prototype, "gi", void 0);
ReturnBlendIngredientData = __decorate([
    (0, type_graphql_1.ObjectType)()
], ReturnBlendIngredientData);
exports.default = ReturnBlendIngredientData;
