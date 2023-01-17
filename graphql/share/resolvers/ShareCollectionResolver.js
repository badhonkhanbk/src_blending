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
const slugify_1 = __importDefault(require("slugify"));
const collectionShare_1 = __importDefault(require("../../../models/collectionShare"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const CreateShareCollectionLink_1 = __importDefault(require("./input-type/CreateShareCollectionLink"));
const CreateCollectionAndShare_1 = __importDefault(require("./input-type/CreateCollectionAndShare"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const CreateNewCollection_1 = __importDefault(require("../../member/resolvers/input-type/CreateNewCollection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
let shareCollectionResolver = class shareCollectionResolver {
    async createCollectionAndShare(data) {
        let token;
        let collectionShareUser;
        let member = await memberModel_1.default.findOne({
            _id: data.sharedBy,
        }).select('email firstName lastName displayName');
        let collectionId = await this.createNewCollection({
            userId: data.sharedBy,
            collection: data.newCollectionData,
        });
        collectionShareUser = await collectionShare_1.default.findOne({
            sharedBy: data.sharedBy,
            collectionId: collectionId,
        });
        if (!collectionShareUser) {
            collectionShareUser = await collectionShare_1.default.create({
                sharedBy: data.sharedBy,
                collectionId: collectionId,
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
    async createNewCollection(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId }).populate('collections');
        if (!user)
            return new AppError_1.default(`User ${data.userId} does not exist`, 402);
        for (let i = 0; i < user.collections.length; i++) {
            if (user.collections[i].name === data.collection.name) {
                return new AppError_1.default(`Collection ${data.collection.name} already exists`, 402);
            }
        }
        let newCollection = data.collection;
        if (!data.collection.slug) {
            newCollection.slug = (0, slugify_1.default)(data.collection.name.toString().toLowerCase());
        }
        else {
            newCollection.slug = data.collection.slug;
        }
        let prevData = await userCollection_1.default.findOne({
            slug: newCollection.slug,
            userId: data.userId,
        });
        if (prevData) {
            return new AppError_1.default('slug must be unique', 401);
        }
        newCollection.userId = user._id;
        let collection = await userCollection_1.default.create(data.collection);
        return collection._id;
    }
    async createShareCollectionLink(data) {
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
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCollectionAndShare_1.default]),
    __metadata("design:returntype", Promise)
], shareCollectionResolver.prototype, "createCollectionAndShare", null);
__decorate([
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewCollection_1.default]),
    __metadata("design:returntype", Promise)
], shareCollectionResolver.prototype, "createNewCollection", null);
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
