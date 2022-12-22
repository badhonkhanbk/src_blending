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
const planCollection_1 = __importDefault(require("../../../models/planCollection"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const PlanCollection_1 = __importDefault(require("../schemas/PlanCollection/PlanCollection"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const AddNewPlanCollection_1 = __importDefault(require("./input-type/PlanCollection/AddNewPlanCollection"));
const PlanCollectionWithDefaultCollection_1 = __importDefault(require("../schemas/PlanCollection/PlanCollectionWithDefaultCollection"));
let PlanCollectionResolver = class PlanCollectionResolver {
    async getAllPlanCollection(memberId) {
        let collections = await planCollection_1.default.find({
            memberId: memberId,
        });
        if (collections.length === 0) {
            console.log('hello');
            let defaultPlanCollection = await planCollection_1.default.create({
                name: 'PLAN',
                slug: 'plan',
                memberId: memberId,
                isDefault: true,
                collectionDataCount: 1,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedPlanCollection: defaultPlanCollection._id,
            });
            return {
                planCollections: [defaultPlanCollection],
                defaultCollection: defaultPlanCollection,
            };
        }
        else {
            let member = await memberModel_1.default.findOne({
                _id: memberId,
            }).select('lastModifiedPlanCollection');
            let defaultPlanCollection = await planCollection_1.default.findOne({
                _id: member.lastModifiedPlanCollection,
            });
            return {
                planCollections: collections,
                defaultCollection: defaultPlanCollection,
            };
        }
    }
    async addToLastModifiedPlanCollection(memberId, planId) {
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedPlanCollection');
        if (!member.lastModifiedPlanCollection) {
            let defaultPlanCollection = await planCollection_1.default.create({
                name: 'PLAN',
                slug: 'plan',
                memberId: memberId,
                isDefault: true,
                plans: [planId],
                collectionDataCount: 1,
            });
            await memberModel_1.default.findOneAndUpdate({
                _id: memberId,
            }, {
                lastModifiedPlanCollection: defaultPlanCollection._id,
            });
            return defaultPlanCollection;
        }
        let planCollection = await planCollection_1.default.findOneAndUpdate({
            _id: member.lastModifiedPlanCollection,
            memberId: memberId,
        }, {
            $addToSet: {
                plans: [planId],
            },
        }, {
            new: true,
        });
        let newPlanCollection = await planCollection_1.default.findOneAndUpdate({ _id: planCollection._id }, { collectionDataCount: planCollection.plans.length }, { new: true });
        return newPlanCollection;
    }
    async addOrRemovePlanCollection(collectionIds, memberId, planId) {
        let collections = await planCollection_1.default.find({
            memberId: memberId,
        });
        for (let i = 0; i < collections.length; i++) {
            let collection = collections[i];
            let index = collectionIds.indexOf(String(collection._id));
            if (index !== -1) {
                let bc = await planCollection_1.default.findOneAndUpdate({
                    _id: collection._id,
                    memberId: memberId,
                }, {
                    $addToSet: {
                        plans: [planId],
                    },
                    //collectionDataCount: collection.blogs.length + 1,
                }, {
                    new: true,
                });
                await planCollection_1.default.findOneAndUpdate({ _id: collection._id }, { collectionDataCount: bc.plans.length });
            }
            else {
                let bc = await planCollection_1.default.findOneAndUpdate({
                    _id: collection._id,
                    memberId: memberId,
                }, {
                    $pull: {
                        plans: planId,
                    },
                    //collectionDataCount: collection.blogs.length - 1,
                }, {
                    new: true,
                });
                await planCollection_1.default.findOneAndUpdate({ _id: collection._id }, { collectionDataCount: bc.plans.length });
            }
        }
        if (collectionIds.length > 0) {
            await memberModel_1.default.findOneAndUpdate({ _id: memberId }, { lastModifiedPlanCollection: collectionIds[collectionIds.length - 1] });
        }
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedPlanCollection');
        let planCollections = await planCollection_1.default.find({
            memberId: memberId,
        });
        let defaultCollection = await planCollection_1.default.findOne({
            _id: member.lastModifiedPlanCollection,
        });
        return {
            planCollections: planCollections,
            defaultCollection: defaultCollection,
        };
    }
    async addNewPlanCollection(data) {
        let newPlanCollection = await planCollection_1.default.create(data);
        return newPlanCollection;
    }
    async deletePlanCollection(collectionId, memberId) {
        let planCollection = await planCollection_1.default.findOne({
            _id: collectionId,
            memberId: memberId,
        }).select('isDefault');
        if (planCollection.isDefault) {
            return new AppError_1.default('Default collection cannot be deleted', 400);
        }
        let member = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedPlanCollection');
        if (String(member.lastModifiedPlanCollection) === collectionId) {
            let defaultCollection = await planCollection_1.default.findOne({
                memberId: memberId,
                isDefault: true,
            }).select('_id');
            await memberModel_1.default.findOneAndUpdate({ _id: memberId }, { lastModifiedPlanCollection: defaultCollection._id });
        }
        if (!planCollection) {
            return new AppError_1.default('Collection not found', 404);
        }
        await planCollection_1.default.findOneAndDelete({
            _id: collectionId,
        });
        let collections = await planCollection_1.default.find({
            memberId: memberId,
        });
        let memberData = await memberModel_1.default.findOne({
            _id: memberId,
        }).select('lastModifiedPlanCollection');
        let defaultCollection = await planCollection_1.default.findOne({
            _id: memberData.lastModifiedPlanCollection,
        });
        return {
            planCollections: collections,
            defaultCollection: defaultCollection,
        };
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => PlanCollectionWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "getAllPlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __param(1, (0, type_graphql_1.Arg)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "addToLastModifiedPlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanCollectionWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('collectionIds', (type) => [String])),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('planId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "addOrRemovePlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewPlanCollection_1.default]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "addNewPlanCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => PlanCollectionWithDefaultCollection_1.default),
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String]),
    __metadata("design:returntype", Promise)
], PlanCollectionResolver.prototype, "deletePlanCollection", null);
PlanCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanCollectionResolver);
exports.default = PlanCollectionResolver;
