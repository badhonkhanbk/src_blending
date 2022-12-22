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
var shareType;
(function (shareType) {
    shareType["collection"] = "collection";
    shareType["recipe"] = "recipe";
})(shareType || (shareType = {}));
(0, type_graphql_1.registerEnumType)(shareType, {
    name: 'shareType',
    description: 'The basic directions', // this one is optional
});
let CreateNewShareLink = class CreateNewShareLink {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateNewShareLink.prototype, "sharedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String]),
    __metadata("design:type", Array)
], CreateNewShareLink.prototype, "shareTo", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [String], { nullable: true }),
    __metadata("design:type", Array)
], CreateNewShareLink.prototype, "shareData", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => shareType),
    __metadata("design:type", String)
], CreateNewShareLink.prototype, "type", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], CreateNewShareLink.prototype, "collectionId", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], CreateNewShareLink.prototype, "all", void 0);
CreateNewShareLink = __decorate([
    (0, type_graphql_1.InputType)()
], CreateNewShareLink);
exports.default = CreateNewShareLink;
