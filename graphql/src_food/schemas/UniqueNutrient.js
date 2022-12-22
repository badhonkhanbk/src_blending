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
var UniqueNutrient_1;
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const RelatedSource_1 = __importDefault(require("./RelatedSource"));
let UniqueNutrient = UniqueNutrient_1 = class UniqueNutrient {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "nutrient", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "nutrientId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "unitName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "min", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "max", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], UniqueNutrient.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "publication_date", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "units", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => UniqueNutrient_1, { nullable: true }),
    __metadata("design:type", UniqueNutrient)
], UniqueNutrient.prototype, "parentNutrient", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [RelatedSource_1.default], { nullable: true }),
    __metadata("design:type", Array)
], UniqueNutrient.prototype, "related_sources", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], UniqueNutrient.prototype, "mapTo", void 0);
UniqueNutrient = UniqueNutrient_1 = __decorate([
    (0, type_graphql_1.ObjectType)()
], UniqueNutrient);
exports.default = UniqueNutrient;
