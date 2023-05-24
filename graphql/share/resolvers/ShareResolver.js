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
const share_1 = __importDefault(require("../../../models/share"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const CreateNewShareLink_1 = __importDefault(require("./input-type/CreateNewShareLink"));
const UserRecipeProfile_1 = __importDefault(require("../../../models/UserRecipeProfile"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const recipeModel_1 = __importDefault(require("../../../models/recipeModel"));
const RecipeVersionModel_1 = __importDefault(require("../../../models/RecipeVersionModel"));
const ShareNotificationsWithCount_1 = __importDefault(require("../schemas/ShareNotificationsWithCount"));
const util_1 = __importDefault(require("../../share/util"));
const mongoose_1 = __importDefault(require("mongoose"));
let shareResolver = class shareResolver {
    async createShareLink(data) {
        let shareDataToStore = {};
        let notFound = [];
        let shareTo = [];
        let globalShare = false;
        if (+data.shareTo.length === 0) {
            globalShare = true;
        }
        // let turnedOnVersionsId = data.shareData.turnedOnVersions.map(
        //   (turnedOnVersion) =>
        //     new mongoose.mongo.ObjectId(turnedOnVersion.toString())
        // );
        let recipe = await recipeModel_1.default.findOne({
            _id: data.shareData.recipeId,
        }).select('_id');
        if (!recipe) {
            await UserRecipeProfile_1.default.findOneAndRemove({
                userId: data.sharedBy,
                recipeId: data.shareData.recipeId,
            });
            return new AppError_1.default('recipe not found', 404);
        }
        let version = await RecipeVersionModel_1.default.findOne({
            _id: data.shareData.version,
        }).select('_id');
        if (!version) {
            return new AppError_1.default('version not found', 404);
        }
        let userRecipe = await UserRecipeProfile_1.default.findOne({
            userId: data.sharedBy,
            recipeId: data.shareData.recipeId,
        }).select('_id');
        if (!userRecipe) {
            return new AppError_1.default('you are not eligible to share this recipe', 401);
        }
        let turnedOnVersions = await RecipeVersionModel_1.default.find({
            _id: {
                $in: data.shareData.turnedOnVersions,
            },
        }).select('_id');
        // console.log(turnedOnVersions.length);
        if (data.shareData.turnedOnVersions.length !== turnedOnVersions.length) {
            return new AppError_1.default('some versions are not found', 404);
        }
        let findShare = await share_1.default.findOne({
            sharedBy: data.sharedBy,
            'shareData.recipeId': data.shareData.recipeId,
            'shareData.version': data.shareData.version,
            'shareData.turnedOnVersions': {
                $in: data.shareData.turnedOnVersions,
            },
            'shareData.turnedOnCount': data.shareData.turnedOnVersions.length,
            isGlobal: globalShare,
        });
        if (findShare) {
            let notFound = [];
            let shareTo = [];
            for (let i = 0; i < data.shareTo.length; i++) {
                let member = await memberModel_1.default.findOne({
                    email: data.shareTo[i],
                }).select('_id');
                if (!member) {
                    notFound.push(data.shareTo[i]);
                }
                else {
                    let shareToAlreadyThere = await share_1.default.findOne({
                        sharedBy: data.sharedBy,
                        'shareData.recipeId': data.shareData.recipeId,
                        'shareTo.userId': {
                            $in: [member._id],
                        },
                    }).select('_id');
                    if (!shareToAlreadyThere) {
                        shareTo.push({
                            userId: member._id,
                            hasAccepted: false,
                        });
                    }
                }
            }
            await share_1.default.findOneAndUpdate({
                sharedBy: data.sharedBy,
                'shareData.recipeId': data.shareData.recipeId,
            }, {
                $push: {
                    shareTo: {
                        $each: shareTo,
                    },
                },
                $addToSet: {
                    notFoundEmails: {
                        $each: notFound,
                    },
                },
            });
            return findShare._id;
        }
        if (+data.shareTo.length === 0) {
            let findGlobalShare = await share_1.default.findOne({
                sharedBy: data.sharedBy,
                'shareData.recipeId': data.shareData.recipeId,
                'shareData.version': data.shareData.version,
                'shareData.turnedOnVersions': {
                    $in: data.shareData.turnedOnVersions,
                },
                'shareData.turnedOnCount': data.shareData.turnedOnVersions.length,
                isGlobal: globalShare,
            });
            if (findGlobalShare) {
                return findGlobalShare._id;
            }
            //@ts-ignore
            shareDataToStore.isGlobal = true;
            shareDataToStore.shareTo = [];
            shareDataToStore.notFoundEmails = [];
        }
        else {
            for (let i = 0; i < data.shareTo.length; i++) {
                let member = await memberModel_1.default.findOne({
                    email: data.shareTo[i],
                }).select('_id');
                if (!member) {
                    notFound.push(data.shareTo[i]);
                }
                else {
                    shareTo.push({
                        userId: member._id,
                        hasAccepted: false,
                    });
                }
            }
            shareDataToStore.shareTo = shareTo;
            shareDataToStore.notFoundEmails = notFound;
        }
        shareDataToStore.sharedBy = data.sharedBy;
        shareDataToStore.shareData = data.shareData;
        shareDataToStore.sharedBy = data.sharedBy;
        let share = await share_1.default.create(shareDataToStore);
        return share._id;
    }
    async getShareNotification(userId) {
        let myShareNotifications = await share_1.default.find({
            shareTo: {
                $elemMatch: {
                    userId: new mongoose_1.default.mongo.ObjectId(userId),
                    hasAccepted: false,
                },
            },
        })
            .populate({
            path: 'sharedBy',
            select: '_id firstName lastName email displayName',
        })
            .populate({
            path: 'shareData.recipeId',
            select: '_id name',
        });
        // console.log(myShareNotifications);
        return {
            shareNotifications: myShareNotifications,
            totalNotification: myShareNotifications.length,
        };
    }
    async acceptRecipeShare(token, userId) {
        let share = await share_1.default.findOne({ _id: token });
        if (!share) {
            return new AppError_1.default('invalid token', 404);
        }
        if (!share.isGlobal) {
            let shareTo = share.shareTo.find((el) => String(el.userId) === String(userId));
            if (!shareTo) {
                return new AppError_1.default('invalid token', 404);
            }
        }
        await share_1.default.findOneAndUpdate({
            _id: token,
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
        }, {
            $set: {
                'shareTo.$.hasAccepted': true,
            },
        });
        let data = await (0, util_1.default)(token.toString(), userId.toString());
        if (!data) {
            return new AppError_1.default('Invalid token', 404);
        }
        let myShareNotifications = await share_1.default.find({
            shareTo: {
                $elemMatch: {
                    userId: new mongoose_1.default.mongo.ObjectId(userId),
                    hasAccepted: false,
                },
            },
        })
            .populate({
            path: 'sharedBy',
            select: '_id firstName lastName email displayName',
        })
            .populate({
            path: 'shareData.recipeId',
            select: '_id name',
        });
        // console.log(myShareNotifications);
        return {
            shareNotifications: myShareNotifications,
            totalNotification: myShareNotifications.length,
        };
    }
    async rejectRecipeShare(token, userId) {
        await share_1.default.findOneAndUpdate({
            _id: token,
            'shareTo.userId': {
                $in: [new mongoose_1.default.mongo.ObjectId(userId)],
            },
        }, {
            $pull: {
                shareTo: {
                    userId: new mongoose_1.default.mongo.ObjectId(userId),
                },
            },
        });
        let myShareNotifications = await share_1.default.find({
            shareTo: {
                $elemMatch: {
                    userId: new mongoose_1.default.mongo.ObjectId(userId),
                    hasAccepted: false,
                },
            },
        })
            .populate({
            path: 'sharedBy',
            select: '_id firstName lastName email displayName',
        })
            .populate({
            path: 'shareData.recipeId',
            select: '_id name',
        });
        // console.log(myShareNotifications);
        return {
            shareNotifications: myShareNotifications,
            totalNotification: myShareNotifications.length,
        };
    }
    async removeAllShare() {
        await share_1.default.deleteMany();
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewShareLink_1.default]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "createShareLink", null);
__decorate([
    (0, type_graphql_1.Query)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "getShareNotification", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "acceptRecipeShare", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('token')),
    __param(1, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "rejectRecipeShare", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "removeAllShare", null);
shareResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], shareResolver);
exports.default = shareResolver;
// @Field()
// sharedBy: String;
// @Field((type) => [String])
// shareTo: [String];
// @Field((type) => [String], { nullable: true })
// shareData: [String];
// @Field((type) => shareType)
// type: shareType;
// @Field({ nullable: true })
// collectionId: String;
// @Field({ nullable: true })
// all: Boolean;
