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
const BlendPortion_1 = __importDefault(require("../../blendIngredientsdata/schemas/BlendPortion"));
const IngredientStats_1 = __importDefault(require("./IngredientStats"));
const OtherIngredientStat_1 = __importDefault(require("./OtherIngredientStat"));
let IngredientStatsWithPortion = class IngredientStatsWithPortion {
};
__decorate([
    (0, type_graphql_1.Field)((type) => [IngredientStats_1.default]),
    __metadata("design:type", Array)
], IngredientStatsWithPortion.prototype, "stats", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", BlendPortion_1.default)
], IngredientStatsWithPortion.prototype, "portion", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], IngredientStatsWithPortion.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [OtherIngredientStat_1.default]),
    __metadata("design:type", Array)
], IngredientStatsWithPortion.prototype, "otherIngredients", void 0);
IngredientStatsWithPortion = __decorate([
    (0, type_graphql_1.ObjectType)()
], IngredientStatsWithPortion);
exports.default = IngredientStatsWithPortion;
