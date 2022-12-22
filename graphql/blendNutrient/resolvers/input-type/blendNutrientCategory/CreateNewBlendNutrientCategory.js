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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
let CreateNewBlendNutrientCategrory = class CreateNewBlendNutrientCategrory {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateNewBlendNutrientCategrory.prototype, "blendId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateNewBlendNutrientCategrory.prototype, "categoryName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewBlendNutrientCategrory.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewBlendNutrientCategrory.prototype, "nutrientDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateNewBlendNutrientCategrory.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewBlendNutrientCategrory.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateNewBlendNutrientCategrory.prototype, "keywords", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateNewBlendNutrientCategrory.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], CreateNewBlendNutrientCategrory.prototype, "rank", void 0);
CreateNewBlendNutrientCategrory = __decorate([
    (0, type_graphql_1.InputType)()
], CreateNewBlendNutrientCategrory);
exports.default = CreateNewBlendNutrientCategrory;
