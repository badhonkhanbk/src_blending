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
const collectionShareGlobal_1 = __importDefault(require("../../../models/collectionShareGlobal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const CreateShareCollectionLink_1 = __importDefault(require("./input-type/CreateShareCollectionLink"));
const CreateCollectionAndShare_1 = __importDefault(require("./input-type/CreateCollectionAndShare"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const mongoose_1 = __importDefault(require("mongoose"));
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
        if (data.shareTo.length <= 0) {
            let ownCollection = await userCollection_1.default.findOne({
                _id: data.collectionId,
                userId: data.sharedBy,
            });
            if (!ownCollection) {
                // let hasAccessForShareCollection = await UserCollectionModel.findOne({
                //   _id: data.collectionId,
                //   shareTo: {
                //     $elemMatch: {
                //       userId: new mongoose.mongo.ObjectId(data.sharedBy.toString()),
                //       hasAccepted: true,
                //     },
                //   },
                // });
                throw new AppError_1.default('You can not share it globally', 404);
            }
            return await this.shareGlobalCollection(data.sharedBy, data.collectionId);
        }
        if (data.isSharedCollection) {
            let collection = await userCollection_1.default.findOne({
                collectionId: data.collectionId,
            });
            let filtered = collection.shareTo.filter((st) => {
                return String(st.userId) === String(data.sharedBy);
            });
            if (filtered.length <= 0) {
                return new AppError_1.default('You can not share it', 404);
            }
            //@ts-ignore
            if (!filtered.canShareWithOthers) {
                return new AppError_1.default('You can not share it', 404);
            }
        }
        for (let i = 0; i < data.shareTo.length; i++) {
            let user = await memberModel_1.default.findOne({
                email: data.shareTo[i].shareToEmail,
            }).select('_id');
            let uc = await userCollection_1.default.findOne({
                _id: data.collectionId,
                'shareTo.userId': {
                    $in: user._id,
                },
            }).select('_id');
            if (uc) {
                console.log('1');
                await userCollection_1.default.findOneAndUpdate({
                    _id: data.collectionId,
                    'shareTo.userId': user._id,
                }, {
                    $set: {
                        'shareTo.$.canContribute': data.shareTo[i].canContribute,
                        'shareTo.$.canShareWithOther': data.shareTo[i].canShareWithOthers,
                    },
                });
            }
            else {
                console.log('2');
                await userCollection_1.default.findOneAndUpdate({
                    _id: data.collectionId,
                }, {
                    $push: {
                        shareTo: {
                            userId: user._id,
                            canContribute: data.shareTo[i].canContribute,
                            canShareWithOther: data.shareTo[i].canShareWithOthers,
                        },
                    },
                });
            }
        }
        return data.collectionId;
    }
    async createCollectionAndShare(data) {
        let newCollection = data.newCollectionData;
        if (!data.newCollectionData.slug) {
            newCollection.slug = (0, slugify_1.default)(data.newCollectionData.name.toString().toLowerCase());
        }
        else {
            newCollection.slug = data.newCollectionData.slug;
        }
        let collection = await userCollection_1.default.create({
            ...newCollection,
            userId: data.sharedBy,
            visible: false,
        });
        if (data.shareTo.length <= 0) {
            //@ts-ignore
            return await this.shareGlobalCollection(data.sharedBy, collection._id);
        }
        for (let i = 0; i < data.shareTo.length; i++) {
            let user = await memberModel_1.default.findOne({
                email: data.shareTo[i].shareToEmail,
            }).select('_id');
            let personalizedName = await this.getPersonalizedName(collection.name, 
            //@ts-ignore
            user._id, 0);
            let personalizedName2 = await this.getPersonalizedName2(personalizedName.name, 
            //@ts-ignore
            user._id, personalizedName.count, collection._id);
            await userCollection_1.default.findOneAndUpdate({
                _id: collection._id,
            }, {
                $push: {
                    shareTo: {
                        userId: user._id,
                        personalizedName: personalizedName2,
                        canContribute: data.shareTo[i].canContribute,
                        canShareWithOther: data.shareTo[i].canShareWithOthers,
                    },
                },
            });
        }
        return collection._id;
    }
    async getPersonalizedName2(name, userId, count, collectionId) {
        let collection;
        if (count === 0) {
            collection = await userCollection_1.default.findOne({
                'shareTo.personalizedName': name,
                'shareTo.userId': new mongoose_1.default.mongo.ObjectId(userId),
            });
        }
        else {
            collection = await userCollection_1.default.findOne({
                'shareTo.personalizedName': name + ' (' + count + ')',
                'shareTo.userId': new mongoose_1.default.mongo.ObjectId(userId),
            });
        }
        if (collection) {
            let newCount = count + 1;
            return await this.getPersonalizedName2(name, userId, newCount, collectionId);
        }
        if (count === 0) {
            return name;
        }
        else {
            return name + ' (' + count + ')';
        }
    }
    async getPersonalizedName(name, userId, count) {
        let collection;
        if (count === 0) {
            collection = await userCollection_1.default.findOne({
                name,
                userId,
            });
        }
        else {
            collection = await userCollection_1.default.findOne({
                name: name + ' (' + count + ')',
                userId,
            });
        }
        if (collection) {
            let newCount = count + 1;
            return await this.getPersonalizedName(name, userId, newCount);
        }
        if (count === 0) {
            return { name: name, count: 0 };
        }
        else {
            return { name: name + ' (' + count + ')', count: count };
        }
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
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateCollectionAndShare_1.default]),
    __metadata("design:returntype", Promise)
], shareCollectionResolver.prototype, "createCollectionAndShare", null);
shareCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], shareCollectionResolver);
exports.default = shareCollectionResolver;
