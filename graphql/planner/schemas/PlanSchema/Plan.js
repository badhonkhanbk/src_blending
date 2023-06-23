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
const PlanCollection_1 = __importDefault(require("../PlanCollection/PlanCollection"));
const PlanData_1 = __importDefault(require("./PlanData"));
const ImageWithHash_1 = __importDefault(require("../ImageWithHash"));
const CalorieInfo_1 = __importDefault(require("../../../recipe/schemas/CalorieInfo"));
const GIGl_1 = __importDefault(require("../../../blendIngredientsdata/schemas/GIGl"));
let Plan = class Plan {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Plan.prototype, "planName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Plan.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "startDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "endDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], Plan.prototype, "memberId", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [PlanData_1.default]),
    __metadata("design:type", Array)
], Plan.prototype, "planData", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Plan.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Plan.prototype, "isGlobal", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "numberOfRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "totalRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "totalViews", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "averageRating", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "myRating", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], Plan.prototype, "collections", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => CalorieInfo_1.default, { nullable: true }),
    __metadata("design:type", CalorieInfo_1.default)
], Plan.prototype, "calorie", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", GIGl_1.default)
], Plan.prototype, "gigl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Plan.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => ImageWithHash_1.default, { nullable: true }),
    __metadata("design:type", ImageWithHash_1.default)
], Plan.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID], { nullable: true }),
    __metadata("design:type", Array)
], Plan.prototype, "planCollections", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [PlanCollection_1.default], { nullable: true }),
    __metadata("design:type", Array)
], Plan.prototype, "planCollectionsDescription", void 0);
Plan = __decorate([
    (0, type_graphql_1.ObjectType)()
], Plan);
exports.default = Plan;
