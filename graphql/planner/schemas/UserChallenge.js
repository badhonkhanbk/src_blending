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
let UserChallenge = class UserChallenge {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], UserChallenge.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserChallenge.prototype, "challengeName", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserChallenge.prototype, "memberId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], UserChallenge.prototype, "description", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], UserChallenge.prototype, "notification", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], UserChallenge.prototype, "startDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String, { nullable: true }),
    __metadata("design:type", String)
], UserChallenge.prototype, "startingDate", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => String),
    __metadata("design:type", String)
], UserChallenge.prototype, "endDateString", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], UserChallenge.prototype, "days", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UserChallenge.prototype, "isActive", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], UserChallenge.prototype, "hasCreatedByMe", void 0);
UserChallenge = __decorate([
    (0, type_graphql_1.ObjectType)()
], UserChallenge);
exports.default = UserChallenge;
