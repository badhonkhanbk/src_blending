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
let shareResolver = class shareResolver {
    async createShareLink(data) {
        let shareDataToStore = {};
        let notFound = [];
        let shareTo = [];
        //@ts-ignore
        if (data.shareTo.length === 0) {
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
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewShareLink_1.default]),
    __metadata("design:returntype", Promise)
], shareResolver.prototype, "createShareLink", null);
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
