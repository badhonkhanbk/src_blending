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
const BlendNutrient_1 = __importDefault(require("./BlendNutrient"));
let ReturnBlendIngredientBasedOnDefaultPortion = class ReturnBlendIngredientBasedOnDefaultPortion {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "ingredientId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendNutrient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "defaultPortionNutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendPortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "varrient", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "source", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "sourceId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "sourceCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "publication_date", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], ReturnBlendIngredientBasedOnDefaultPortion.prototype, "gi", void 0);
ReturnBlendIngredientBasedOnDefaultPortion = __decorate([
    (0, type_graphql_1.ObjectType)()
], ReturnBlendIngredientBasedOnDefaultPortion);
exports.default = ReturnBlendIngredientBasedOnDefaultPortion;
