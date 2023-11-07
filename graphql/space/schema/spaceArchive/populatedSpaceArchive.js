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
const SpaceBlog_1 = __importDefault(require("../spaceBlog/SpaceBlog"));
const Member_1 = __importDefault(require("../../../member/schemas/Member"));
const Space_1 = __importDefault(require("../Space"));
let PopulatedSpaceArchive = class PopulatedSpaceArchive {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], PopulatedSpaceArchive.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], PopulatedSpaceArchive.prototype, "archiveName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], PopulatedSpaceArchive.prototype, "icon", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [SpaceBlog_1.default], { nullable: true }),
    __metadata("design:type", Array)
], PopulatedSpaceArchive.prototype, "spaceBlogs", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Member_1.default, { nullable: true }),
    __metadata("design:type", String)
], PopulatedSpaceArchive.prototype, "createdBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Space_1.default),
    __metadata("design:type", String)
], PopulatedSpaceArchive.prototype, "spaceId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], PopulatedSpaceArchive.prototype, "blogsCount", void 0);
PopulatedSpaceArchive = __decorate([
    (0, type_graphql_1.ObjectType)()
], PopulatedSpaceArchive);
exports.default = PopulatedSpaceArchive;
