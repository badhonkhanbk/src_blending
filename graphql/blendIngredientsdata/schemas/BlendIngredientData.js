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
const Ingredient_1 = __importDefault(require("../../src_food/schemas/Ingredient"));
const NutrientValue_1 = __importDefault(require("../../src_food/schemas/NutrientValue"));
const BlendPortion_1 = __importDefault(require("./BlendPortion"));
const BlendNutrient_1 = __importDefault(require("./BlendNutrient"));
let BlendIngredientData = class BlendIngredientData {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "varrient", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Ingredient_1.default, { nullable: true }),
    __metadata("design:type", Ingredient_1.default)
], BlendIngredientData.prototype, "srcFoodReference", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendNutrient_1.default], { nullable: true }),
    __metadata("design:type", BlendNutrient_1.default)
], BlendIngredientData.prototype, "blendNutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrientValue_1.default], { nullable: true }),
    __metadata("design:type", Array)
], BlendIngredientData.prototype, "notBlendNutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendPortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], BlendIngredientData.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlendIngredientData.prototype, "sourceName", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], BlendIngredientData.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], BlendIngredientData.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], BlendIngredientData.prototype, "gi", void 0);
BlendIngredientData = __decorate([
    (0, type_graphql_1.ObjectType)()
], BlendIngredientData);
exports.default = BlendIngredientData;
// ingredientName: String,
//   category: String,
//   blendStatus: String,
//   classType: String,
//   description: String,
//   srcFoodReference: { type: Schema.Types.ObjectId, ref: 'Ingredient' },
//   blendNutrients: [
//     {
//       value: String,
//       blendNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'BlendNutrient',
//       },
//     },
//   ],
//   notBlendNutrients: [
//     {
//       value: String,
//       sourceId: String,
//       uniqueNutrientRefference: {
//         type: Schema.Types.ObjectId,
//         ref: 'UniqueNutrient',
//       },
//     },
//   ],
//   portions: [
//     {
//       measurement: String,
//       measurement2: String,
//       meausermentWeight: String,
//       default: Boolean,
//       sourceId: String,
//     },
//   ],
//   featuredImage: String,
//   images: [String],
//   collections: [
//     {
//       type: Schema.Types.ObjectId,
//       ref: 'AdminCollection',
//     },
//   ],
//   createdAt: { type: Date, default: Date.now },
//   modifiedAt: { type: Date, default: Date.now },
