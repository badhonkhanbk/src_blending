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
const CreateNutrientValue_1 = __importDefault(require("./CreateNutrientValue"));
const CreatePortion_1 = __importDefault(require("./CreatePortion"));
let CreateEditIngredient = class CreateEditIngredient {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "ingredientName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "blendStatus", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "classType", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreateNutrientValue_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditIngredient.prototype, "nutrients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [CreatePortion_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditIngredient.prototype, "portions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "source", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "sourceId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "sourceCategory", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "publication_date", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "featuredImage", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditIngredient.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditIngredient.prototype, "defaultPortion", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditIngredient.prototype, "collections", void 0);
CreateEditIngredient = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditIngredient);
exports.default = CreateEditIngredient;
