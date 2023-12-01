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
const MemberFacilitator_1 = __importDefault(require("./MemberFacilitator"));
const MeetupSolution_1 = __importDefault(require("./MeetupSolution"));
const UserFacilitator_1 = __importDefault(require("./UserFacilitator"));
const GuestFacilitator_1 = __importDefault(require("./GuestFacilitator"));
const Admin_1 = __importDefault(require("../../admin/resolvers/schemas/Admin"));
let Space = class Space {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], Space.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Space.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], Space.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Admin_1.default, { nullable: true }),
    __metadata("design:type", Admin_1.default)
], Space.prototype, "createdBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [MemberFacilitator_1.default]),
    __metadata("design:type", Array)
], Space.prototype, "members", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [UserFacilitator_1.default]),
    __metadata("design:type", Array)
], Space.prototype, "facilitators", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [GuestFacilitator_1.default]),
    __metadata("design:type", Array)
], Space.prototype, "guests", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => MeetupSolution_1.default),
    __metadata("design:type", MeetupSolution_1.default)
], Space.prototype, "meetupSolutions", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], Space.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Space.prototype, "isEnabledJoin", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Space.prototype, "isPublishedToDiscovery", void 0);
Space = __decorate([
    (0, type_graphql_1.ObjectType)()
], Space);
exports.default = Space;
