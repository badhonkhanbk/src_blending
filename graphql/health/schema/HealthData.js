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
const IngreidntHealthType_1 = __importDefault(require("./IngreidntHealthType"));
const NutrientHealthType_1 = __importDefault(require("./NutrientHealthType"));
let HealthData = class HealthData {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HealthData.prototype, "healthTopic", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], HealthData.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], HealthData.prototype, "aliases", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], HealthData.prototype, "source", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [IngreidntHealthType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], HealthData.prototype, "foods", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [NutrientHealthType_1.default], { nullable: true }),
    __metadata("design:type", Array)
], HealthData.prototype, "nutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthData.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthData.prototype, "class", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthData.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], HealthData.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], HealthData.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HealthData.prototype, "imageCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HealthData.prototype, "nutrientCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], HealthData.prototype, "foodCount", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], HealthData.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], HealthData.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], HealthData.prototype, "createdAt", void 0);
HealthData = __decorate([
    (0, type_graphql_1.ObjectType)()
], HealthData);
exports.default = HealthData;
