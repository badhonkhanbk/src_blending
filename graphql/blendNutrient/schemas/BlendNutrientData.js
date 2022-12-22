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
var BlendNutrientData_1;
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const BlendNutrientCategory_1 = __importDefault(require("./BlendNutrientCategory"));
const BlendRelatedSource_1 = __importDefault(require("./BlendRelatedSource"));
const map_1 = __importDefault(require("./map"));
let BlendNutrientData = BlendNutrientData_1 = class BlendNutrientData {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "blendId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "nutrientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "altName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => BlendNutrientCategory_1.default, { nullable: true }),
    __metadata("design:type", BlendNutrientCategory_1.default)
], BlendNutrientData.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => BlendNutrientData_1, { nullable: true }),
    __metadata("design:type", BlendNutrientData)
], BlendNutrientData.prototype, "parent", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], BlendNutrientData.prototype, "parentIsCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], BlendNutrientData.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "min_measure", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "unitName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientData.prototype, "units", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [BlendRelatedSource_1.default], { nullable: true }),
    __metadata("design:type", Array)
], BlendNutrientData.prototype, "related_sources", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [map_1.default], { nullable: true }),
    __metadata("design:type", Array)
], BlendNutrientData.prototype, "mapList", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], BlendNutrientData.prototype, "showChildren", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], BlendNutrientData.prototype, "usePriorityForMap", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], BlendNutrientData.prototype, "isBookmarked", void 0);
BlendNutrientData = BlendNutrientData_1 = __decorate([
    (0, type_graphql_1.ObjectType)()
], BlendNutrientData);
exports.default = BlendNutrientData;
