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
const collectionShare_1 = __importDefault(require("../../../models/collectionShare"));
const collectionShareGlobal_1 = __importDefault(require("../../../models/collectionShareGlobal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const CreateShareCollectionLink_1 = __importDefault(require("./input-type/CreateShareCollectionLink"));
let shareCollectionResolver = class shareCollectionResolver {
    async shareGlobalCollection(sharedBy, collectionId) {
        let globalShareCollection;
        globalShareCollection = await collectionShareGlobal_1.default.findOne({
            sharedBy,
            collectionId,
        });
        if (!globalShareCollection) {
            globalShareCollection = await collectionShareGlobal_1.default.create({
                sharedBy,
                collectionId,
            });
        }
        return globalShareCollection._id;
    }
    async createShareCollectionLink(data) {
        if (data.shareToEmails.length <= 0) {
            return await this.shareGlobalCollection(data.sharedBy, data.collectionId[0]);
        }
        let token;
        let collectionShareUser;
        collectionShareUser = await collectionShare_1.default.findOne({
            sharedBy: data.sharedBy,
            collectionId: data.collectionId,
        });
        if (!collectionShareUser) {
            collectionShareUser = await collectionShare_1.default.create({
                sharedBy: data.sharedBy,
                collectionId: data.collectionId,
            });
        }
        token = collectionShareUser._id;
        for (let i = 0; i < data.shareToEmails.length; i++) {
            let user = await memberModel_1.default.findOne({
                email: data.shareToEmails[i],
            }).select('_id');
            if (!user) {
                continue;
            }
            if (String(user._id) === String(data.sharedBy)) {
                continue;
            }
            let shareTo = collectionShareUser.shareTo;
            let index = shareTo.findIndex((share) => String(share.userId) === String(user._id));
            if (index === -1) {
                shareTo.push({
                    userId: user._id,
                    hasAccepted: false,
                });
            }
            await collectionShare_1.default.findByIdAndUpdate(collectionShareUser._id, {
                shareTo,
            }, { new: true });
        }
        return token;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('sharedBy', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('collectionId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], shareCollectionResolver.prototype, "shareGlobalCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateShareCollectionLink_1.default]),
    __metadata("design:returntype", Promise)
], shareCollectionResolver.prototype, "createShareCollectionLink", null);
shareCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], shareCollectionResolver);
exports.default = shareCollectionResolver;
// sharedBy: {
//   type: SchemaTypes.ObjectId,
//   ref: 'Member',
//   required: [true, 'MemberId is required'],
// },
// shareTo: [
//   {
//     userId: {
//       type: SchemaTypes.ObjectId,
//       ref: 'Member',
//     },
//     hasAccepted: Boolean,
//   },
// ],
// collectionId: {
//   type: SchemaTypes.ObjectId,
//   ref: 'UserCollection',
// },
