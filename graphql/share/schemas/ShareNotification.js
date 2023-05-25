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
const ShareData_1 = __importDefault(require("./ShareData"));
const ShareBy_1 = __importDefault(require("./ShareBy"));
let ShareNotification = class ShareNotification {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], ShareNotification.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => ShareData_1.default, { nullable: true }),
    __metadata("design:type", ShareData_1.default)
], ShareNotification.prototype, "shareData", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => ShareBy_1.default, { nullable: true }),
    __metadata("design:type", ShareBy_1.default)
], ShareNotification.prototype, "sharedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Date)
], ShareNotification.prototype, "createdAt", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], ShareNotification.prototype, "image", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], ShareNotification.prototype, "type", void 0);
ShareNotification = __decorate([
    (0, type_graphql_1.ObjectType)()
], ShareNotification);
exports.default = ShareNotification;
