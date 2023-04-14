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
const QASimpleIngredient_1 = __importDefault(require("./QASimpleIngredient"));
const QAIngredientAndPercentage_1 = __importDefault(require("./QAIngredientAndPercentage"));
let QAForAdmin = class QAForAdmin {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], QAForAdmin.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], QAForAdmin.prototype, "quantity", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "unit", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "userIngredient", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "status", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "action", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String]),
    __metadata("design:type", Array)
], QAForAdmin.prototype, "issues", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], QAForAdmin.prototype, "bestMatchCounts", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [QAIngredientAndPercentage_1.default]),
    __metadata("design:type", Array)
], QAForAdmin.prototype, "matchedIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => QASimpleIngredient_1.default, { nullable: true }),
    __metadata("design:type", QASimpleIngredient_1.default)
], QAForAdmin.prototype, "bestMatch", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID]),
    __metadata("design:type", Array)
], QAForAdmin.prototype, "versions", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], QAForAdmin.prototype, "errorParsed", void 0);
QAForAdmin = __decorate([
    (0, type_graphql_1.ObjectType)()
], QAForAdmin);
exports.default = QAForAdmin;
