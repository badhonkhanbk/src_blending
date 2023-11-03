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
const RoleType_1 = __importDefault(require("./RoleType"));
let CreateRole = class CreateRole {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], CreateRole.prototype, "roleName", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Users", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Admin", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Dashboard", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Shop", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Blend", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Wiki", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "Space", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => RoleType_1.default),
    __metadata("design:type", RoleType_1.default)
], CreateRole.prototype, "All", void 0);
CreateRole = __decorate([
    (0, type_graphql_1.InputType)()
], CreateRole);
exports.default = CreateRole;
