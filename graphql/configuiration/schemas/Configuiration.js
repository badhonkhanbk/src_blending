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
const AgeType_1 = __importDefault(require("./AgeType"));
let Configuiration = class Configuiration {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], Configuiration.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Configuiration.prototype, "gender", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Configuiration.prototype, "weightInKilograms", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Configuiration.prototype, "heightInCentimeters", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Configuiration.prototype, "pregnantOrLactating", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => AgeType_1.default, { nullable: true }),
    __metadata("design:type", AgeType_1.default)
], Configuiration.prototype, "age", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Configuiration.prototype, "activity", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Configuiration.prototype, "dieteryLifeStyle", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Configuiration.prototype, "allergies", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Configuiration.prototype, "preExistingMedicalConditions", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Configuiration.prototype, "meditcation", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], Configuiration.prototype, "whyBlending", void 0);
Configuiration = __decorate([
    (0, type_graphql_1.ObjectType)()
], Configuiration);
exports.default = Configuiration;
