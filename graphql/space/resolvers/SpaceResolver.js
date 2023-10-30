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
const space_1 = __importDefault(require("../../../models/space"));
const CreateSpace_1 = __importDefault(require("./input-type/CreateSpace"));
const Space_1 = __importDefault(require("../schema/Space"));
let SpaceResolver = class SpaceResolver {
    async createNewSpace(spaceData) {
        let space = await space_1.default.create(spaceData);
        return space._id;
    }
    async getAllSpaces() {
        let spaces = await space_1.default.find()
            .populate('users.userId')
            .populate('members.userId')
            .populate('facilitators.invitedBy')
            .populate('members.invitedBy')
            .populate('createdBy')
            .lean();
        return spaces;
    }
    async getSpaceById(spaceId) {
        let space = await space_1.default.findById(spaceId);
        return space;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('spaceData', (type) => CreateSpace_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSpace_1.default]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "createNewSpace", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Space_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getAllSpaces", null);
__decorate([
    (0, type_graphql_1.Query)(() => Space_1.default),
    __param(0, (0, type_graphql_1.Arg)('spaceId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getSpaceById", null);
SpaceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceResolver);
exports.default = SpaceResolver;
