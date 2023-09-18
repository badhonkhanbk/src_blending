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
let PlanComment = class PlanComment {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], PlanComment.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PlanComment.prototype, "comment", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], PlanComment.prototype, "planId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Member_1.default),
    __metadata("design:type", Member_1.default)
], PlanComment.prototype, "memberId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Date),
    __metadata("design:type", Date)
], PlanComment.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Date, { nullable: true }),
    __metadata("design:type", Date)
], PlanComment.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], PlanComment.prototype, "commentsCount", void 0);
PlanComment = __decorate([
    (0, type_graphql_1.ObjectType)()
], PlanComment);
exports.default = PlanComment;
