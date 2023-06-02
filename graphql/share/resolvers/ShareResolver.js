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
const ShareNotification_1 = __importDefault(require("../schemas/ShareNotification"));
const ShareNotificationsWithCount_1 = __importDefault(require("../schemas/ShareNotificationsWithCount"));
const util_1 = __importDefault(require("../../share/util"));
const mongoose_1 = __importDefault(require("mongoose"));
const userCollection_1 = __importDefault(require("../../../models/userCollection"));
const ProfileRecipeDesc_1 = __importDefault(require("../../recipe/schemas/ProfileRecipeDesc"));
const makeGlobalRecipe_1 = __importDefault(require("../util/makeGlobalRecipe"));
const collectionShareGlobal_1 = __importDefault(require("../../../models/collectionShareGlobal"));
const checkShareCollectionLink_1 = __importDefault(require("../util/checkShareCollectionLink"));
const InviteForChallenge_1 = __importDefault(require("../../../models/InviteForChallenge"));
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
        let returnNotification = [];
        let singleRecipeShareNotification = await this.getShareNotificationForSingleRecipe(userId);
        returnNotification.push(...singleRecipeShareNotification);
        let collectionShareNotification = await this.getShareNotificationForCollection(userId);
        returnNotification.push(...collectionShareNotification);
        let challengeInviteNotification = await this.getInviteNotificationForChallenge(userId);
        returnNotification.push(...challengeInviteNotification);
        return {
            shareNotifications: returnNotification,
            totalNotification: singleRecipeShareNotification.length +
                collectionShareNotification.length +
                challengeInviteNotification.length,
        };
    }
    async getInviteNotificationForChallenge(userId) {
        let invites = await InviteForChallenge_1.default.find({
            invitedWith: {
                $elemMatch: {
                    memberId: new mongoose_1.default.mongo.ObjectId(userId),
                    hasAccepted: false,
                },
            },
        })
            .populate({
            path: 'invitedBy',
            select: '_id firstName lastName email displayName image',
        })
            .populate({
            path: 'challengeId',
            select: '_id challengeName',
        });
        let returnNotification = [];
        if (invites.length <= 0) {
            return [];
        }
        // console.log(invites.length);
        for (let i = 0; i < invites.length; i++) {
            let entity = {};
            entity._id = invites[i]._id;
            entity.sharedBy = invites[i].invitedBy;
            entity.createdAt = invites[i].createdAt;
            entity.type = 'Challenge';
            entity.shareData = {
                _id: invites[i].challengeId._id,
                entityId: {
                    _id: invites[i].challengeId._id,
                    name: invites[i].challengeId.challengeName,
                },
            };
            returnNotification.push(entity);
        }
        return returnNotification;
    }
    async getShareNotificationForSingleRecipe(userId) {
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
            select: '_id firstName lastName email displayName image',
        })
            .populate({
            path: 'shareData.recipeId',
            select: '_id name image',
        });
        if (myShareNotifications.length === 0) {
            return [];
        }
        let returnNotification = [];
        for (let i = 0; i < myShareNotifications.length; i++) {
            let singleEntity = {};
            singleEntity = myShareNotifications[i];
            //@ts-ignore
            let recipeImages = myShareNotifications[i].shareData.recipeId.image;
            let searchDefaultImage = null;
            if (recipeImages.length > 0) {
                searchDefaultImage = recipeImages.filter((ri) => ri.default === true)[0];
                let image = searchDefaultImage ? searchDefaultImage.image : null;
                if (!image) {
                    singleEntity.image = recipeImages[0].image;
                }
                else {
                    singleEntity.image = image;
                }
            }
            else {
                singleEntity.image = null;
            }
            // console.log(singleEntity.image);
            singleEntity.shareData.entityId =
                myShareNotifications[i].shareData.recipeId;
            singleEntity.type = 'Recipe';
            returnNotification.push(singleEntity);
        }
        return returnNotification;
    }
    async getShareNotificationForCollection(userId) {
        let mySharedNotification = await userCollection_1.default.find({
            shareTo: {
                $elemMatch: {
                    userId: new mongoose_1.default.mongo.ObjectId(userId),
                    hasAccepted: false,
                },
            },
        }).populate({
            path: 'userId',
            select: '_id firstName lastName email displayName image',
        });
        // console.log(mySharedNotification);
        if (mySharedNotification.length === 0) {
            return [];
        }
        let returnNotification = [];
        for (let i = 0; i < mySharedNotification.length; i++) {
            let singleEntity = {};
            if (mySharedNotification[i].recipes.length === 0) {
                singleEntity.image = null;
            }
            else {
                let recipe = await recipeModel_1.default.findOne({
                    _id: mySharedNotification[i].recipes[mySharedNotification[i].recipes.length - 1],
                }).select('image');
                let searchDefaultImage = null;
                if (recipe.image.length > 0) {
                    searchDefaultImage = recipe.image.filter((ri) => ri.default === true)[0];
                    let image = searchDefaultImage ? searchDefaultImage.image : null;
                    if (!image) {
                        singleEntity.image = recipe.image[0].image;
                    }
                    else {
                        singleEntity.image = image;
                    }
                }
                else {
                    singleEntity.image = null;
                }
            }
            singleEntity._id = mySharedNotification[i]._id;
            singleEntity.sharedBy = mySharedNotification[i].userId;
            singleEntity.createdAt = mySharedNotification[i].createdAt;
            singleEntity.shareData = {
                _id: mySharedNotification[i]._id,
                entityId: {
                    _id: mySharedNotification[i]._id,
                    name: mySharedNotification[i].name,
                },
            };
            singleEntity.type = 'Collection';
            returnNotification.push(singleEntity);
        }
        return returnNotification;
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
        let data = await (0, util_1.default)(token.toString(), userId.toString());
        if (!data) {
            return new AppError_1.default('Invalid token', 404);
        }
        return await this.getShareNotification(userId);
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
        return await this.getShareNotification(userId);
    }
    async removeAllShare() {
        await share_1.default.deleteMany();
        return 'done';
    }
    async viewSharedRecipe(userId, token) {
        const share = await share_1.default.findOne({ _id: token });
        if (!share.isGlobal) {
            let auth = share.shareTo.filter((sharePerson) => {
                return String(sharePerson.userId) === String(userId);
            })[0];
            console.log(auth);
            if (!auth) {
                return new AppError_1.default('Invalid token', 404);
            }
        }
        if (!share) {
            return new AppError_1.default('Invalid token', 404);
        }
        return await (0, makeGlobalRecipe_1.default)(share, userId.toString());
    }
    // @Query((type) => Collection)
    // async viewSharedCollection(
    //   @Arg('userId') userId: String,
    //   @Arg('token') token: String,
    //   @Arg('page', { nullable: true }) page: number,
    //   @Arg('limit', { nullable: true }) limit: number
    // ) {
    //   if (!page || page <= 0) {
    //     page = 1;
    //   }
    //   if (!limit) {
    //     limit = 10;
    //   }
    //   let start = (page - 1) * limit;
    //   let end = start + limit;
    //   const shareCollection = await UserCollectionModel.findOne({
    //     _id: token,
    //   }).populate({
    //     path: 'userId',
    //   });
    //   if (!shareCollection) {
    //     return new AppError('Invalid token', 404);
    //   }
    //   let returnRecipe = [];
    //   for (let i = start; i < end; i++) {
    //     returnRecipe.push(
    //       await makeShareRecipe(
    //         shareCollection.recipes[i],
    //         String(shareCollection.userId)
    //       )
    //     );
    //   }
    //   return {
    //     _id: shareCollection._id,
    //     name: shareCollection.name,
    //     slug: shareCollection.slug,
    //     image: shareCollection.image,
    //     totalRecipes: shareCollection.recipes.length,
    //     recipes: returnRecipe,
    //     creatorInfo: shareCollection.userId,
    //   };
    // }
    async acceptShareCollection(userId, token) {
        let shareCollection = await userCollection_1.default.findOne({ _id: token });
        if (!shareCollection) {
            return new AppError_1.default('invalid token', 404);
        }
        let checkIfGlobal = await collectionShareGlobal_1.default.findOne({
            collectionId: token,
        });
        console.log(checkIfGlobal);
        if (!checkIfGlobal) {
            let shareTo = shareCollection.shareTo.find((el) => String(el.userId) === String(userId));
            if (!shareTo) {
                return new AppError_1.default('invalid token', 404);
            }
        }
        for (let i = 0; i < shareCollection.recipes.length; i++) {
            await (0, checkShareCollectionLink_1.default)(String(shareCollection.recipes[i]), String(shareCollection.userId), userId);
        }
        if (checkIfGlobal) {
            await collectionShareGlobal_1.default.findOneAndUpdate({
                collectionId: token,
            }, {
                $addToSet: {
                    globalAccepted: userId,
                },
            });
        }
        else {
            await userCollection_1.default.findOneAndUpdate({
                _id: token,
                'shareTo.userId': {
                    $in: [new mongoose_1.default.mongo.ObjectId(userId)],
                },
            }, {
                $set: {
                    'shareTo.$.hasAccepted': true,
                },
            });
        }
        return await this.getShareNotification(userId);
    }
    async rejectShareCollection(userId, token) {
        let shareCollection = await userCollection_1.default.findOne({ _id: token });
        if (!shareCollection) {
            return new AppError_1.default('invalid token', 404);
        }
        let checkIfGlobal = await collectionShareGlobal_1.default.findOne({
            collectionId: token,
        });
        console.log(checkIfGlobal);
        if (!checkIfGlobal) {
            let shareTo = shareCollection.shareTo.find((el) => String(el.userId) === String(userId));
            if (!shareTo) {
                return new AppError_1.default('invalid token', 404);
            }
        }
        await userCollection_1.default.findOneAndUpdate({ _id: token }, {
            $pull: {
                shareTo: {
                    userId: userId,
                },
            },
        });
        return await this.getShareNotification(userId);
    }
    async rejectChallengeInvite(inviteId, memberId) {
        let invite = await InviteForChallenge_1.default.findOne({ _id: inviteId });
        if (!invite) {
            return new AppError_1.default('Invalid invite', 400);
        }
        let data = invite.invitedWith.filter(
        //@ts-ignore
        (iw) => String(iw.memberId) === memberId)[0];
        console.log(data);
        if (!data) {
            return new AppError_1.default('Invalid invite', 400);
        }
        let mongoMemberId = new mongoose_1.default.mongo.ObjectId(memberId.toString());
        let inviteChallenge = await InviteForChallenge_1.default.findOneAndUpdate({ _id: inviteId }, {
            $pull: {
                invitedWith: {
                    memberId: mongoMemberId,
                },
            },
        });
        return await this.getShareNotification(memberId);
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
    (0, type_graphql_1.Query)(() => [ShareNotification_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "getInviteNotificationForChallenge", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ShareNotification_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "getShareNotificationForSingleRecipe", null);
__decorate([
    (0, type_graphql_1.Query)(() => [ShareNotification_1.default]),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "getShareNotificationForCollection", null);
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
__decorate([
    (0, type_graphql_1.Query)((type) => ProfileRecipeDesc_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "viewSharedRecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "acceptShareCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __param(1, (0, type_graphql_1.Arg)('token')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "rejectShareCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => ShareNotificationsWithCount_1.default),
    __param(0, (0, type_graphql_1.Arg)('inviteId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "rejectChallengeInvite", null);
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
