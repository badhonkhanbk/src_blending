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
const DateStats_1 = __importDefault(require("./DateStats"));
const ingredientStatsForNutrient_1 = __importDefault(require("./ingredientStatsForNutrient"));
let BlendNutrientStats = class BlendNutrientStats {
};
__decorate([
    (0, type_graphql_1.Field)((type) => [ingredientStatsForNutrient_1.default]),
    __metadata("design:type", Array)
], BlendNutrientStats.prototype, "ingredientStats", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [DateStats_1.default]),
    __metadata("design:type", Array)
], BlendNutrientStats.prototype, "dateStats", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BlendNutrientStats.prototype, "dailyAverage", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BlendNutrientStats.prototype, "dailyRecomended", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BlendNutrientStats.prototype, "attainment", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BlendNutrientStats.prototype, "upperLimit", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientStats.prototype, "units", void 0);
BlendNutrientStats = __decorate([
    (0, type_graphql_1.ObjectType)()
], BlendNutrientStats);
exports.default = BlendNutrientStats;
