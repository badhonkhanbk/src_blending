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
const CategoryPercentage_1 = __importDefault(require("./CategoryPercentage"));
const Plan_1 = __importDefault(require("./Plan"));
const TopIngredient_1 = __importDefault(require("./TopIngredient"));
let PlanIngredientAndCategory = class PlanIngredientAndCategory {
};
__decorate([
    (0, type_graphql_1.Field)((type) => Plan_1.default),
    __metadata("design:type", Plan_1.default)
], PlanIngredientAndCategory.prototype, "plan", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [TopIngredient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PlanIngredientAndCategory.prototype, "topIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CategoryPercentage_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PlanIngredientAndCategory.prototype, "recipeCategoriesPercentage", void 0);
PlanIngredientAndCategory = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlanIngredientAndCategory);
exports.default = PlanIngredientAndCategory;
