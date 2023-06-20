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
const Recipe_1 = __importDefault(require("../../recipe/schemas/Recipe"));
const Wikilist_1 = __importDefault(require("../../wiki/schemas/Wikilist"));
const Plan_1 = __importDefault(require("../../planner/schemas/PlanSchema/Plan"));
let DataType = class DataType {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], DataType.prototype, "collectionType", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [Recipe_1.default], { nullable: true }),
    __metadata("design:type", Array)
], DataType.prototype, "Recipes", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Wikilist_1.default], { nullable: true }),
    __metadata("design:type", Array)
], DataType.prototype, "Wikis", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [Plan_1.default], { nullable: true }),
    __metadata("design:type", Array)
], DataType.prototype, "Plans", void 0);
DataType = __decorate([
    (0, type_graphql_1.ObjectType)()
], DataType);
exports.default = DataType;
