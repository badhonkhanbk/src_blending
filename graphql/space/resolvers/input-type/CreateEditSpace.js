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
const FacilitatorInput_1 = __importDefault(require("./FacilitatorInput"));
const MeetupSolutionsInput_1 = __importDefault(require("./MeetupSolutionsInput"));
let CreateEditSpace = class CreateEditSpace {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditSpace.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditSpace.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], CreateEditSpace.prototype, "createdBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [FacilitatorInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditSpace.prototype, "members", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [FacilitatorInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditSpace.prototype, "facilitators", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [FacilitatorInput_1.default], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditSpace.prototype, "guests", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => MeetupSolutionsInput_1.default, { nullable: true }),
    __metadata("design:type", MeetupSolutionsInput_1.default)
], CreateEditSpace.prototype, "meetupSolutions", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditSpace.prototype, "isEnabledJoin", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditSpace.prototype, "isPublishedToDiscovery", void 0);
CreateEditSpace = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditSpace);
exports.default = CreateEditSpace;
