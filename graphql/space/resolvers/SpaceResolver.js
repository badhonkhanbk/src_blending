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
const space_1 = __importDefault(require("../../../models/space"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const CreateSpace_1 = __importDefault(require("./input-type/CreateSpace"));
const Space_1 = __importDefault(require("../schema/Space"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const EditSpace_1 = __importDefault(require("./input-type/EditSpace"));
const addOrRemoveFacilitators_1 = __importDefault(require("../util/addOrRemoveFacilitators"));
const MembersWithPagination_1 = __importDefault(require("../schema/MembersWithPagination"));
let SpaceResolver = class SpaceResolver {
    /**
     * Create a new space.
     *
     * @param {CreateNewSpace} spaceData - the data for the new space
     * @return {string} the ID of the newly created space
     */
    async createNewSpace(spaceData) {
        let space = await space_1.default.create(spaceData);
        return space._id;
    }
    /**
     * Retrieves all spaces based on the provided userId.
     *
     * @param {string} userId - The ID of the user to retrieve spaces for. Can be nullable.
     * @return {Promise<any[]>} An array of spaces that match the provided userId.
     */
    async getAllSpaces(userId) {
        let find = {};
        if (userId) {
            find['members.userId'] = userId;
        }
        console.log(find);
        let spaces = await space_1.default.find(find)
            .populate('members.userId')
            .populate('facilitators.userId')
            .populate('facilitators.invitedBy')
            .populate('members.invitedBy')
            .populate('createdBy')
            .lean();
        return spaces;
    }
    /**
     * Joins a space by adding a user to the members list.
     *
     * @param {string} spaceId - The ID of the space.
     * @param {string} userId - The ID of the user.
     * @return {Promise<string | AppError>} Returns a promise that resolves to either a success message or an AppError.
     */
    async joinASpace(spaceId, userId) {
        let space = await space_1.default.findOne({ _id: spaceId });
        if (!space) {
            return new AppError_1.default('space not found', 404);
        }
        let found = false;
        for (let i = 0; i < space.members.length; i++) {
            if (String(space.members[i].userId) === userId) {
                found = true;
                break;
            }
        }
        if (found) {
            return new AppError_1.default('User is already in space', 404);
        }
        else {
            await space_1.default.findOneAndUpdate({
                _id: spaceId,
            }, {
                $push: {
                    members: {
                        userId: userId,
                        hasAccepted: true,
                    },
                },
            });
        }
        return 'done';
    }
    /**
     * Edits a space.
     *
     * @param {EditSpace} data - the data to edit the space
     * @return {Promise<Space>} the edited space
     */
    async editASpace(data) {
        var _a, _b;
        let space = await space_1.default.findOne({ _id: data.editId });
        if (!space) {
            return new AppError_1.default('space not found', 404);
        }
        let notFacilitators = [];
        if (data.editableObject.facilitators) {
            let prevFacilitators = (_a = space.facilitators) === null || _a === void 0 ? void 0 : _a.filter((facilitator) => facilitator.userId).map((user) => {
                return String(user.userId);
            });
            if (!prevFacilitators) {
                prevFacilitators = [];
            }
            console.log('prev :', prevFacilitators);
            // previous facilitator list above
            let facilitators = (_b = data.editableObject.facilitators) === null || _b === void 0 ? void 0 : _b.filter((facilitator) => facilitator.userId).map((user) => {
                return String(user.userId);
            });
            if (!facilitators) {
                facilitators = [];
            }
            console.log('new :', facilitators);
            // new facilitator list above
            if (facilitators.length > 0 && prevFacilitators.length > 0) {
                for (let i = 0; i < prevFacilitators.length; i++) {
                    if (facilitators.includes(prevFacilitators[i])) {
                        let index = facilitators.indexOf(prevFacilitators[i]);
                        facilitators.splice(index, 1);
                    }
                    else {
                        notFacilitators.push(prevFacilitators[i]);
                    }
                }
            }
            if (facilitators.length > 0) {
                console.log('y: ', facilitators);
                await (0, addOrRemoveFacilitators_1.default)(String(space._id), facilitators, false);
            }
            if (notFacilitators.length > 0) {
                console.log('n: ', notFacilitators);
                await (0, addOrRemoveFacilitators_1.default)(String(space._id), notFacilitators, true);
            }
        }
        let editedSpace = await space_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject, {
            new: true,
        });
        return editedSpace;
    }
    /**
     * Retrieves a space by its ID.
     *
     * @param {string} spaceId - The ID of the space.
     * @return {Promise<Space>} The space object.
     */
    async getSpaceById(spaceId) {
        let space = await space_1.default.findById(spaceId)
            .populate('members.userId')
            .populate('facilitators.userId')
            .populate('facilitators.invitedBy')
            .populate('members.invitedBy')
            .populate('createdBy')
            .lean();
        return space;
    }
    async getAllMembersOfASpace(spaceId, forFacilitators, page, limit) {
        if (!page) {
            page = 1;
        }
        if (!limit) {
            limit = 10;
        }
        let skip = limit * (page - 1);
        let space = await space_1.default.findOne({ _id: spaceId });
        if (!space) {
            return new AppError_1.default('space not found', 404);
        }
        if (!forFacilitators) {
            let membersId = space.members.map((member) => member.userId);
            let members = await memberModel_1.default.find({
                _id: { $in: membersId },
            })
                .select('image displayName firstName lastName email')
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                users: members,
                total: await memberModel_1.default.countDocuments({
                    _id: { $in: membersId },
                }),
            };
        }
        else {
            let membersId = space.facilitators.map((facilitator) => facilitator.userId);
            let members = await memberModel_1.default.find({
                _id: { $in: membersId },
            })
                .select('image displayName firstName lastName email')
                .skip(skip)
                .limit(limit)
                .lean();
            return {
                users: members,
                total: await memberModel_1.default.countDocuments({
                    _id: { $in: membersId },
                }),
            };
        }
    }
    /**
     * A description of the entire function.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    async util() {
        let users = await memberModel_1.default.find().select('_id');
        for (let i = 0; i < users.length; i++) {
            let space = await space_1.default.findOne({ _id: '6541fb2b6bb5c182179337d6' });
            let userId = String(users[i]._id);
            let index = space.members.findIndex((member) => String(member.userId) === userId);
            if (index === -1) {
                await space_1.default.findOneAndUpdate({
                    _id: '6541fb2b6bb5c182179337d6',
                }, {
                    $push: {
                        members: {
                            userId,
                        },
                    },
                });
            }
        }
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Create a new space.
     *
     * @param {CreateNewSpace} spaceData - the data for the new space
     * @return {string} the ID of the newly created space
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceData', (type) => CreateSpace_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateSpace_1.default]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "createNewSpace", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Space_1.default])
    /**
     * Retrieves all spaces based on the provided userId.
     *
     * @param {string} userId - The ID of the user to retrieve spaces for. Can be nullable.
     * @return {Promise<any[]>} An array of spaces that match the provided userId.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId', (type) => type_graphql_1.ID, { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getAllSpaces", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Joins a space by adding a user to the members list.
     *
     * @param {string} spaceId - The ID of the space.
     * @param {string} userId - The ID of the user.
     * @return {Promise<string | AppError>} Returns a promise that resolves to either a success message or an AppError.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceId', (type) => type_graphql_1.ID)),
    __param(1, (0, type_graphql_1.Arg)('userId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "joinASpace", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => Space_1.default)
    /**
     * Edits a space.
     *
     * @param {EditSpace} data - the data to edit the space
     * @return {Promise<Space>} the edited space
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditSpace_1.default]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "editASpace", null);
__decorate([
    (0, type_graphql_1.Query)(() => Space_1.default)
    /**
     * Retrieves a space by its ID.
     *
     * @param {string} spaceId - The ID of the space.
     * @return {Promise<Space>} The space object.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getSpaceById", null);
__decorate([
    (0, type_graphql_1.Query)(() => MembersWithPagination_1.default),
    __param(0, (0, type_graphql_1.Arg)('spaceId')),
    __param(1, (0, type_graphql_1.Arg)('forFacilitators', { nullable: true })),
    __param(2, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(3, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        Boolean, Number, Number]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getAllMembersOfASpace", null);
__decorate([
    (0, type_graphql_1.Query)(() => String)
    /**
     * A description of the entire function.
     *
     * @param {type} paramName - description of parameter
     * @return {type} description of return value
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "util", null);
SpaceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceResolver);
exports.default = SpaceResolver;
