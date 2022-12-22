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
const Admin_1 = __importDefault(require("./schemas/Admin"));
const PopulatedAdmin_1 = __importDefault(require("./schemas/PopulatedAdmin"));
const NewAdminInput_1 = __importDefault(require("./input-type/NewAdminInput"));
const Admin_2 = __importDefault(require("../../../models/Admin"));
const EditAdmin_1 = __importDefault(require("./input-type/EditAdmin"));
let AdminResolver = class AdminResolver {
    async createNewAdmin(data) {
        let admin = await Admin_2.default.create(data);
        return admin;
    }
    async getASingleAdmin(adminId) {
        let admin = await Admin_2.default.findOne({ _id: adminId });
        return admin;
    }
    async getAllAdmin() {
        const admins = await Admin_2.default.find().populate('role');
        return admins;
    }
    async removeAdmin(email) {
        await Admin_2.default.findOneAndDelete({ email: email });
        return 'success';
    }
    async editAdmin(data) {
        await Admin_2.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => Admin_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [NewAdminInput_1.default]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "createNewAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => Admin_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('adminId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getASingleAdmin", null);
__decorate([
    (0, type_graphql_1.Query)(() => [PopulatedAdmin_1.default]) // admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "getAllAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "removeAdmin", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAdmin_1.default]),
    __metadata("design:returntype", Promise)
], AdminResolver.prototype, "editAdmin", null);
AdminResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminResolver);
exports.default = AdminResolver;
