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
const CreateUserChallenge_1 = __importDefault(require("./input-type/CreateUserChallenge"));
const CreateEditUserChallenge_1 = __importDefault(require("./input-type/CreateEditUserChallenge"));
const UserChallenge_1 = __importDefault(require("../schemas/UserChallenge"));
const challenge_1 = __importDefault(require("../../../models/challenge"));
const shareChallengeGlobal_1 = __importDefault(require("../../../models/shareChallengeGlobal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const FormateDate_1 = __importDefault(require("../../../utils/FormateDate"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const challengeInfoForId_1 = __importDefault(require("../schemas/challengeInfoForId"));
let ChallengeResolver = class ChallengeResolver {
    async createUserChallenge(data) {
        let userChallenges = await challenge_1.default.find({
            memberId: data.memberId,
        });
        if (userChallenges.length === 0) {
            let modifiedData = data;
            modifiedData.isActive = true;
            let userChallenge = await challenge_1.default.create(modifiedData);
            return userChallenge._id;
        }
        let userChallenge = await challenge_1.default.create(data);
        return userChallenge._id;
    }
    async activateChallenge(memberId, challengeId, previousDefaultChallengeId) {
        if (previousDefaultChallengeId) {
            let previousDefaultChallenge = await challenge_1.default.findOne({
                _id: previousDefaultChallengeId,
            });
            if (String(previousDefaultChallenge.memberId) === memberId) {
                await challenge_1.default.updateMany({
                    memberId: memberId,
                }, {
                    isActive: false,
                });
            }
            else {
                await challenge_1.default.findOneAndUpdate({
                    _id: previousDefaultChallengeId,
                    'sharedWith.memberId': memberId,
                }, {
                    $set: { 'sharedWith.$.isDefault': false },
                });
            }
        }
        let userChallenge = await challenge_1.default.findOne({ _id: challengeId });
        if (String(userChallenge.memberId) === memberId) {
            await challenge_1.default.findOneAndUpdate({ _id: challengeId }, {
                isActive: true,
            });
        }
        else {
            await challenge_1.default.findOneAndUpdate({
                _id: challengeId,
                'sharedWith.memberId': memberId,
            }, {
                $set: { 'sharedWith.$.isDefault': true },
            });
            await memberModel_1.default.findOneAndUpdate({ _id: memberId }, { defaultChallengeId: challengeId });
        }
        return 'done';
    }
    async editUserChallenge(data) {
        let userChallengeValid = await challenge_1.default.findOne({
            _id: data.challengeId,
        }).select('memberId');
        if (String(data.memberId) !== String(userChallengeValid.memberId)) {
            return new AppError_1.default('you are not authorized to update', 401);
        }
        if (data.isActive) {
            await challenge_1.default.updateMany({
                memberId: data.memberId,
            }, {
                isActive: false,
            });
        }
        let modifiedData = data;
        if (data.startDate) {
            modifiedData.startingDate =
                data.startDate.toLocaleString('default', {
                    month: 'short',
                }) +
                    ' ' +
                    data.startDate.getDate() +
                    ', ' +
                    data.startDate.getFullYear();
            modifiedData.startDateString = (0, FormateDate_1.default)(data.startDate);
        }
        if (data.endDate) {
            modifiedData.endDateString = (0, FormateDate_1.default)(data.endDate);
        }
        let userChallenge = await challenge_1.default.findOneAndUpdate({ _id: data.challengeId }, modifiedData, { new: true });
        return userChallenge._id;
    }
    async getMyChallengeList(memberId) {
        let list = [];
        let userChallenges = await challenge_1.default.find({
            memberId: memberId,
        }).select('-sharedWith -topIngredients');
        for (let i = 0; i < userChallenges.length; i++) {
            let userChallenge = userChallenges[i];
            userChallenge.hasCreatedByMe = true;
            list.push(userChallenge);
        }
        let sharedChallenges = await challenge_1.default.find({
            memberId: { $ne: memberId.toString() },
            'sharedWith.memberId': {
                $in: memberId.toString(),
            },
        }).select('-isActive -topIngredients');
        for (let i = 0; i < sharedChallenges.length; i++) {
            let sharedChallenge = sharedChallenges[i];
            let sharedWith = sharedChallenge.sharedWith.filter((sw) => String(sw.memberId) === memberId)[0];
            sharedChallenge.hasCreatedByMe = false;
            sharedChallenge.isActive = sharedWith.isDefault;
            list.push(sharedChallenge);
        }
        return list;
    }
    async getChallengeInfoById(challengeId, token) {
        let userChallenge = await challenge_1.default.findOne({
            _id: challengeId,
        });
        if (!userChallenge) {
            return new AppError_1.default('Challenge not found', 404);
        }
        let memberInfo = await memberModel_1.default.findOne({
            _id: userChallenge.memberId,
        }).select('image displayName');
        let data = {
            challengeName: userChallenge.challengeName,
            memberInfo,
        };
        return data;
    }
    async getChallengeById(challengeId) {
        let userChallenge = await challenge_1.default.findOne({
            _id: challengeId,
        });
        return userChallenge;
    }
    async deleteUserChallenge(challengeId) {
        await challenge_1.default.findOneAndDelete({
            _id: challengeId,
        });
        return 'successfully deleted';
    }
    async shareGlobalChallenge(challengeId, memberId) {
        let challenge = await challenge_1.default.findOne({ _id: challengeId });
        if (String(challenge.memberId) !== memberId) {
            return new AppError_1.default('You are not authorized to share this challenge', 401);
        }
        let shareChallengeGlobal = await shareChallengeGlobal_1.default.create({
            challengeId: challengeId,
        });
        return shareChallengeGlobal._id;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateUserChallenge_1.default]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "createUserChallenge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('challengeId')),
    __param(2, (0, type_graphql_1.Arg)('previousDefaultChallengeId', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "activateChallenge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditUserChallenge_1.default]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "editUserChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserChallenge_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getMyChallengeList", null);
__decorate([
    (0, type_graphql_1.Query)(() => challengeInfoForId_1.default),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getChallengeInfoById", null);
__decorate([
    (0, type_graphql_1.Query)(() => UserChallenge_1.default),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "getChallengeById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "deleteUserChallenge", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('challengeId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], ChallengeResolver.prototype, "shareGlobalChallenge", null);
ChallengeResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ChallengeResolver);
exports.default = ChallengeResolver;
