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
const nutrientMatrix_1 = __importDefault(require("../../../../recipe/resolvers/input-type/nutrientMatrix"));
const NutrienFilterForRecipe_1 = __importDefault(require("../../../../recipe/resolvers/input-type/NutrienFilterForRecipe"));
let FilterPlan = class FilterPlan {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], FilterPlan.prototype, "userId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], FilterPlan.prototype, "includeIngredientIds", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], FilterPlan.prototype, "excludeIngredientIds", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [nutrientMatrix_1.default], { nullable: true }),
    __metadata("design:type", Array)
], FilterPlan.prototype, "nutrientMatrix", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrienFilterForRecipe_1.default], { nullable: true }),
    __metadata("design:type", Array)
], FilterPlan.prototype, "nutrientFilters", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], FilterPlan.prototype, "collectionsIds", void 0);
FilterPlan = __decorate([
    (0, type_graphql_1.InputType)()
], FilterPlan);
exports.default = FilterPlan;
