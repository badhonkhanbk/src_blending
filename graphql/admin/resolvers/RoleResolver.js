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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const Role_1 = __importDefault(require("./schemas/Role"));
const RoleModel_1 = __importDefault(require("../../../models/RoleModel"));
const AddNewRole_1 = __importDefault(require("./input-type/AddNewRole"));
const EditRole_1 = __importDefault(require("./input-type/EditRole"));
let RoleResolver = class RoleResolver {
    async createNewRole(data) {
        let role = await RoleModel_1.default.create(data);
        return role;
    }
    async getASingleRole(roleId) {
        let role = await RoleModel_1.default.findOne({ _id: roleId });
        return JSON.stringify(role);
    }
    async getAllRoles() {
        const roles = await RoleModel_1.default.find();
        return roles;
    }
    async removeRole(roleId) {
        await RoleModel_1.default.findOneAndDelete({ _id: roleId });
        return 'success';
    }
    async editRole(data) {
        await RoleModel_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Role_1.default) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewRole_1.default]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "createNewRole", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "getASingleRole", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Role_1.default]) // admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "getAllRoles", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('roleId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "removeRole", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditRole_1.default]),
    __metadata("design:returntype", Promise)
], RoleResolver.prototype, "editRole", null);
RoleResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RoleResolver);
exports.default = RoleResolver;
