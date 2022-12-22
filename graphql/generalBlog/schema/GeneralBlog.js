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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
let GeneralBlog = class GeneralBlog {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], GeneralBlog.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GeneralBlog.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GeneralBlog.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GeneralBlog.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], GeneralBlog.prototype, "body", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String]),
    __metadata("design:type", Array)
], GeneralBlog.prototype, "keywords", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "createdBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], GeneralBlog.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], GeneralBlog.prototype, "updatedAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "coverImage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "mediaUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], GeneralBlog.prototype, "mediaLength", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], GeneralBlog.prototype, "publishDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Date)
], GeneralBlog.prototype, "publishDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], GeneralBlog.prototype, "commentsCount", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], GeneralBlog.prototype, "hasInCollection", void 0);
GeneralBlog = __decorate([
    (0, type_graphql_1.ObjectType)()
], GeneralBlog);
exports.default = GeneralBlog;
// title: String!
//   slug: String!
//   body: String!
//   keywords: [String!]
//   type: String
//   createdBy: ID
//   category: String
//   description: String
//   coverImage: String
//   mediaUrl: String
//   mediaLength: Float
//   isPublished: Boolean!
//   publishDateString: String
