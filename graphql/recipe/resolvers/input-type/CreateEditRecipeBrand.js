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
let CreateEditRecipeBrand = class CreateEditRecipeBrand {
};
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "brandName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateEditRecipeBrand.prototype, "isPublished", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "brandDescription", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "brandImage", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "brandIcon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "brandUrl", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "title", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "canonicalURL", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "siteMap", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateEditRecipeBrand.prototype, "metaDesc", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateEditRecipeBrand.prototype, "keywords", void 0);
CreateEditRecipeBrand = __decorate([
    (0, type_graphql_1.InputType)()
], CreateEditRecipeBrand);
exports.default = CreateEditRecipeBrand;
