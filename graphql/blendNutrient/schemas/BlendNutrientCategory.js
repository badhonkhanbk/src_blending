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
let BlendNutrientCategory = class BlendNutrientCategory {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "blendId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "categoryName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "nutrientDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], BlendNutrientCategory.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], BlendNutrientCategory.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], BlendNutrientCategory.prototype, "keywords", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], BlendNutrientCategory.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], BlendNutrientCategory.prototype, "rank", void 0);
BlendNutrientCategory = __decorate([
    (0, type_graphql_1.ObjectType)()
], BlendNutrientCategory);
exports.default = BlendNutrientCategory;
