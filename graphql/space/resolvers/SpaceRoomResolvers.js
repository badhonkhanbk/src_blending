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
const spaceRoom_1 = __importDefault(require("../../../models/spaceRoom"));
const createNewSpaceRoom_1 = __importDefault(require("./input-type/spaceRoom/createNewSpaceRoom"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const SimpeSpaceRoom_1 = __importDefault(require("../schema/spaceRoom/SimpeSpaceRoom"));
const SpaceRoom_1 = __importDefault(require("../schema/spaceRoom/SpaceRoom"));
const EditSpaceRoom_1 = __importDefault(require("./input-type/spaceRoom/EditSpaceRoom"));
let SpaceResolver = class SpaceResolver {
    /**
     * Creates a new space room.
     *
     * @param {CreateNewSpaceRoom} spaceRoomData - The data for creating a new space room.
     * @return {Promise<SpaceRoom>} The newly created space room.
     */
    async createNewSpaceRoom(data) {
        let space = await space_1.default.findOne({ _id: data.spaceId });
        if (!space) {
            return new AppError_1.default('space not found', 404);
        }
        let spaceRoom = await spaceRoom_1.default.create(data);
        console.log(spaceRoom);
        return spaceRoom;
    }
    /**
     * Retrieves all space rooms for the given space ID.
     *
     * @param {ID} spaceId - The ID of the space
     * @return {Promise<SpaceRoom[]>} An array of space rooms
     */
    async getAllSpaceRooms(spaceId) {
        let spaceRooms = await spaceRoom_1.default.find({ spaceId: spaceId }).populate('createdBy');
        return spaceRooms;
    }
    /**
     * Retrieves a space room by its ID.
     *
     * @param {string} spaceRoomId - The ID of the space room.
     * @return {Promise<SpaceRoom | AppError>} The space room object if found, or an AppError if not found.
     */
    async getSpaceRoomById(spaceRoomId) {
        let spaceRoom = await spaceRoom_1.default.findById(spaceRoomId).populate('createdBy');
        if (!spaceRoom) {
            return new AppError_1.default('space room not found', 404);
        }
        return spaceRoom;
    }
    /**
     * Deletes a space room.
     *
     * @param {string} spaceRoomId - The ID of the space room to delete.
     * @return {Promise<string>} A promise that resolves to 'done' if the space room was successfully deleted.
     */
    async deleteSpaceRoom(spaceRoomId) {
        let spaceRoom = await spaceRoom_1.default.findById(spaceRoomId);
        if (!spaceRoom) {
            return new AppError_1.default('space room not found', 404);
        }
        await spaceRoom.remove();
        return 'done';
    }
    /**
     * Edits a space room.
     *
     * @param {EditSpaceRoom} data - The data used to edit the space room.
     * @return {Promise<string>} A string indicating success.
     */
    async editASpaceRoom(data) {
        await spaceRoom_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => SimpeSpaceRoom_1.default)
    /**
     * Creates a new space room.
     *
     * @param {CreateNewSpaceRoom} spaceRoomData - The data for creating a new space room.
     * @return {Promise<SpaceRoom>} The newly created space room.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceRoomData', (type) => createNewSpaceRoom_1.default)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [createNewSpaceRoom_1.default]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "createNewSpaceRoom", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SpaceRoom_1.default])
    /**
     * Retrieves all space rooms for the given space ID.
     *
     * @param {ID} spaceId - The ID of the space
     * @return {Promise<SpaceRoom[]>} An array of space rooms
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getAllSpaceRooms", null);
__decorate([
    (0, type_graphql_1.Query)(() => SpaceRoom_1.default)
    /**
     * Retrieves a space room by its ID.
     *
     * @param {string} spaceRoomId - The ID of the space room.
     * @return {Promise<SpaceRoom | AppError>} The space room object if found, or an AppError if not found.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceRoomId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "getSpaceRoomById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Deletes a space room.
     *
     * @param {string} spaceRoomId - The ID of the space room to delete.
     * @return {Promise<string>} A promise that resolves to 'done' if the space room was successfully deleted.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('spaceRoomId', (type) => type_graphql_1.ID)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "deleteSpaceRoom", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Edits a space room.
     *
     * @param {EditSpaceRoom} data - The data used to edit the space room.
     * @return {Promise<string>} A string indicating success.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('EditSpaceRoom')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditSpaceRoom_1.default]),
    __metadata("design:returntype", Promise)
], SpaceResolver.prototype, "editASpaceRoom", null);
SpaceResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], SpaceResolver);
exports.default = SpaceResolver;
