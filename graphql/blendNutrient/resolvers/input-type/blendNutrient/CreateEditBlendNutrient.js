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
const createEditMap_1 = __importDefault(require("./createEditMap"));
let CreateEditBlendNutrient = class CreateEditBlendNutrient {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "blendId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "nutrientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "altName", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "parent", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditBlendNutrient.prototype, "showChildren", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditBlendNutrient.prototype, "parentIsCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], CreateEditBlendNutrient.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "min_measure", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "unitName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditBlendNutrient.prototype, "units", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [createEditMap_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditBlendNutrient.prototype, "mapList", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditBlendNutrient.prototype, "usePriorityForMap", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditBlendNutrient.prototype, "isBookmarked", void 0);
CreateEditBlendNutrient = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditBlendNutrient);
exports.default = CreateEditBlendNutrient;
