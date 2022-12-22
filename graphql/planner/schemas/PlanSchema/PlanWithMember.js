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
const Member_1 = __importDefault(require("../../../member/schemas/Member"));
const PlanCollection_1 = __importDefault(require("../PlanCollection/PlanCollection"));
const PlanData_1 = __importDefault(require("./PlanData"));
let PlanWithMember = class PlanWithMember {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], PlanWithMember.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlanWithMember.prototype, "planName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlanWithMember.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PlanWithMember.prototype, "startDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PlanWithMember.prototype, "endDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Member_1.default),
    __metadata("design:type", Member_1.default)
], PlanWithMember.prototype, "memberId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [PlanData_1.default]),
    __metadata("design:type", Array)
], PlanWithMember.prototype, "planData", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PlanWithMember.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PlanWithMember.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], PlanWithMember.prototype, "isGlobal", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], PlanWithMember.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PlanWithMember.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", PlanCollection_1.default)
], PlanWithMember.prototype, "planCollection", void 0);
PlanWithMember = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlanWithMember);
exports.default = PlanWithMember;
