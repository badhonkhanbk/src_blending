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
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const SpaceInviteInput_1 = __importDefault(require("./input-type/SpaceInvite.ts/SpaceInviteInput"));
const SpaceInvite_1 = __importDefault(require("../../../models/SpaceInvite"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const SpaceInvite_2 = __importDefault(require("../schema/SpaceInvite/SpaceInvite"));
const spaceRoom_1 = __importDefault(require("../../../models/spaceRoom"));
let SpaceInviteResolver = class SpaceInviteResolver {
    async createSpaceInvite(data) {
        let spaceRoom = await spaceRoom_1.default.findOne({
            _id: data.spaceRoomId,
        }).select('_id');
        if (!spaceRoom) {
            return new AppError_1.default('space room not found', 404);
        }
        let spaceInvite = await SpaceInvite_1.default.findOne({
            spaceRoomId: data.spaceRoomId,
        });
        let spaceInviteId;
        if (!spaceInvite) {
            let usersData = await this.getUserList(data.inviteTo);
            let newSpace = await SpaceInvite_1.default.create({
                inviteTo: usersData.users,
                message: data.message ? data.message : '',
                spaceRoomId: data.spaceRoomId,
                createdBy: data.createdBy ? data.createdBy : null,
                notFoundEmails: usersData.notFoundEmails,
            });
            spaceInviteId = newSpace._id;
        }
        else {
            spaceInviteId = spaceInvite._id;
            let usersData = await this.getUserList(data.inviteTo);
            let newUserList = [];
            for (let i = 0; i < usersData.users.length; i++) {
                let find = spaceInvite.inviteTo.findIndex((inviteToUser) => String(inviteToUser.user) === String(usersData.users[i]));
                if (!find) {
                    newUserList.push(usersData.users[i]);
                }
            }
            await SpaceInvite_1.default.findOneAndUpdate({ _id: spaceInviteId }, {
                $set: {
                    inviteTo: spaceInvite.inviteTo.concat(newUserList),
                    message: data.message ? data.message : '',
                },
                $addToSet: {
                    notFoundEmails: spaceInvite.notFoundEmails.concat(usersData.notFoundEmails),
                },
            });
        }
        let newSpaceInvite = await SpaceInvite_1.default.findOne({
            _id: spaceInviteId,
        }).populate({
            path: 'inviteTo.user',
            select: 'firstName lastName email displayName _id',
        });
        return newSpaceInvite;
    }
    async getSpaceInviteInfo(spaceRoomId) {
        let spaceRoom = await spaceRoom_1.default.findOne({
            _id: spaceRoomId,
        }).select('_id');
        if (!spaceRoom) {
            return new AppError_1.default('space room not found', 404);
        }
        let spaceInvite = await SpaceInvite_1.default.findOne({
            spaceRoomId: spaceRoomId,
        }).populate({
            path: 'inviteTo.user',
            select: 'firstName lastName email displayName _id',
        });
        if (!spaceInvite) {
            return new AppError_1.default('space invite not found', 404);
        }
        return spaceInvite;
    }
    async getUserList(inviteTo) {
        let users = [];
        let notFoundEmails = [];
        for (let i = 0; i < inviteTo.length; i++) {
            let user = await memberModel_1.default.findOne({ email: inviteTo[i] }).select('_id');
            if (!user) {
                notFoundEmails.push(inviteTo[i]);
            }
            else {
                let makeUser = {
                    user: user._id,
                    hasAccepted: false,
                };
                users.push(makeUser);
            }
        }
        return {
            users,
            notFoundEmails,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SpaceInvite_2.default),
    __param(0, (0, type_graphql_1.Arg)('spaceRoomData', (type) => SpaceInviteInput_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [SpaceInviteInput_1.default]),
    __metadata("design:returntype", Promise)
], SpaceInviteResolver.prototype, "createSpaceInvite", null);
__decorate([
    (0, type_graphql_1.Query)(() => SpaceInvite_2.default),
    __param(0, (0, type_graphql_1.Arg)('spaceRoomId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceInviteResolver.prototype, "getSpaceInviteInfo", null);
SpaceInviteResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceInviteResolver);
exports.default = SpaceInviteResolver;
