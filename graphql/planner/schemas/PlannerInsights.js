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
const CategoryPercentage_1 = __importDefault(require("./PlanSchema/CategoryPercentage"));
const TopIngredient_1 = __importDefault(require("./PlanSchema/TopIngredient"));
const MacroMakeup_1 = __importDefault(require("./PlanSchema/MacroMakeup"));
let PlannerInsights = class PlannerInsights {
};
__decorate([
    (0, type_graphql_1.Field)((type) => [TopIngredient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PlannerInsights.prototype, "topIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CategoryPercentage_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PlannerInsights.prototype, "recipeCategoriesPercentage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => MacroMakeup_1.default, { nullable: true }),
    __metadata("design:type", MacroMakeup_1.default)
], PlannerInsights.prototype, "macroMakeup", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PlannerInsights.prototype, "calorie", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PlannerInsights.prototype, "netCarbs", void 0);
PlannerInsights = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlannerInsights);
exports.default = PlannerInsights;
