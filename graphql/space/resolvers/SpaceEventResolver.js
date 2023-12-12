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
const CreateSpaceEvent_1 = __importDefault(require("./input-type/spaceEvent/CreateSpaceEvent"));
const spaceEvent_1 = __importDefault(require("../../../models/spaceEvent"));
const SimpleSpaceEvent_1 = __importDefault(require("../schema/spaceEvent/SimpleSpaceEvent"));
const SpaceEvent_1 = __importDefault(require("../schema/spaceEvent/SpaceEvent"));
const EditSpaceEvent_1 = __importDefault(require("./input-type/spaceEvent/EditSpaceEvent"));
let SpaceEventResolver = class SpaceEventResolver {
    async createNewSpaceEvent(data) {
        let newSpaceEventData = data;
        if (data.createdAtStringType) {
            newSpaceEventData.createdAtDateType = new Date(data.createdAtStringType).toISOString();
        }
        let spaceEvent = await spaceEvent_1.default.create(newSpaceEventData);
        let createdSpaceEvent = await spaceEvent_1.default.findOne({
            _id: spaceEvent._id,
        });
        return createdSpaceEvent;
    }
    async getAllSpaceEvents() {
        let spaceEvents = await spaceEvent_1.default.find({}).sort({
            createdAtDateType: -1,
        });
        return spaceEvents;
    }
    async getASpaceEvent(spaceEventId) {
        let spaceEvent = await spaceEvent_1.default.findOne({ _id: spaceEventId })
            .populate('tickets.rooms')
            .lean();
        if (!spaceEvent) {
            throw new AppError_1.default('space event not found', 404);
        }
        return spaceEvent;
    }
    async editASpaceEvent(data) {
        let modifiedData = data.editableObject;
        if (data.editableObject.createdAtStringType) {
            modifiedData.createdAtDateType = new Date(data.editableObject.createdAtStringType).toISOString();
        }
        await spaceEvent_1.default.findOneAndUpdate({ _id: data.editId }, modifiedData);
        let updatedSpaceEvent = await spaceEvent_1.default.findOne({
            _id: data.editId,
        });
        return updatedSpaceEvent;
    }
    async deleteSpaceEvent(spaceEventId) {
        await spaceEvent_1.default.findOneAndDelete({ _id: spaceEventId });
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SimpleSpaceEvent_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSpaceEvent_1.default]),
    __metadata("design:returntype", Promise)
], SpaceEventResolver.prototype, "createNewSpaceEvent", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleSpaceEvent_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpaceEventResolver.prototype, "getAllSpaceEvents", null);
__decorate([
    (0, type_graphql_1.Query)(() => SpaceEvent_1.default),
    __param(0, (0, type_graphql_1.Arg)('spaceEventId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceEventResolver.prototype, "getASpaceEvent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => SimpleSpaceEvent_1.default),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditSpaceEvent_1.default]),
    __metadata("design:returntype", Promise)
], SpaceEventResolver.prototype, "editASpaceEvent", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('spaceEventId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceEventResolver.prototype, "deleteSpaceEvent", null);
SpaceEventResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceEventResolver);
exports.default = SpaceEventResolver;
