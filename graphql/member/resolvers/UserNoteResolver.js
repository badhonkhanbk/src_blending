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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const recipe_1 = __importDefault(require("../../../models/recipe"));
const userNote_1 = __importDefault(require("../../../models/userNote"));
const CreateNewNote_1 = __importDefault(require("./input-type/CreateNewNote"));
const GetMyNote_1 = __importDefault(require("./input-type/GetMyNote"));
const EditUserNote_1 = __importDefault(require("./input-type/EditUserNote"));
const UserNote_1 = __importDefault(require("../schemas/UserNote"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const RemoveNote_1 = __importDefault(require("./input-type/RemoveNote"));
let UserNotesResolver = class UserNotesResolver {
    /**
     * Creates a new note.
     *
     * @param {CreateUserNote} data - the data for creating a new note
     * @return {Promise<UserNote[]>} an array of notes
     */
    async createNewNote(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        await userNote_1.default.create(data);
        let notes = await userNote_1.default.find({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return notes;
    }
    /**
     * Retrieves the notes of a user for a specific recipe.
     *
     * @param {GetMyNote} data - The data object containing the user ID and recipe ID.
     * @return {Promise<UserNote[]>} The notes of the user for the specified recipe.
     */
    async getMyNotesForARecipe(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let recipe = await recipe_1.default.findOne({ _id: data.recipeId });
        if (!recipe) {
            return new AppError_1.default('Recipe not found', 404);
        }
        let Notes = await userNote_1.default.find({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return Notes;
    }
    /**
     * Edit a user's note.
     *
     * @param {EditUserNote} data - The data of the note to be edited.
     * @return {Promise<Array<UserNote>>} - A promise that resolves to an array of user notes.
     */
    async editMyNote(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let newData = data.editableObject;
        newData.updatedAt = Date.now();
        await userNote_1.default.findByIdAndUpdate(data.noteId, newData);
        let notes = await userNote_1.default.find({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return notes;
    }
    /**
     * Remove a user's note.
     *
     * @param {RemoveNote} data - The data object containing userId, noteId, and recipeId.
     * @return {Promise<UserNote[]>} - An array of user notes.
     */
    async removeMyNote(data) {
        let user = await memberModel_1.default.findOne({ _id: data.userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let note = await userNote_1.default.findOne({
            _id: data.noteId,
            recipeId: data.recipeId,
            userId: data.userId,
        });
        if (!note) {
            return new AppError_1.default('Note not found', 404);
        }
        await userNote_1.default.findByIdAndDelete(data.noteId);
        let notes = await userNote_1.default.find({
            userId: data.userId,
            recipeId: data.recipeId,
        });
        return notes;
    }
    /**
   * Retrieves all the notes belonging to a specific user.
   *
   * @param {String} userId - The ID of the user whose notes are to be retrieved.
   * @return {Array} An array of user notes.
   */
    async getAllMyNotes(userId) {
        let user = await memberModel_1.default.findOne({ _id: userId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let Notes = await userNote_1.default.find({ userId: userId });
        return Notes;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => [UserNote_1.default])
    /**
     * Creates a new note.
     *
     * @param {CreateUserNote} data - the data for creating a new note
     * @return {Promise<UserNote[]>} an array of notes
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "createNewNote", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserNote_1.default]),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GetMyNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "getMyNotesForARecipe", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [UserNote_1.default])
    /**
     * Edit a user's note.
     *
     * @param {EditUserNote} data - The data of the note to be edited.
     * @return {Promise<Array<UserNote>>} - A promise that resolves to an array of user notes.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditUserNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "editMyNote", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => [UserNote_1.default])
    /**
     * Remove a user's note.
     *
     * @param {RemoveNote} data - The data object containing userId, noteId, and recipeId.
     * @return {Promise<UserNote[]>} - An array of user notes.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RemoveNote_1.default]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "removeMyNote", null);
__decorate([
    (0, type_graphql_1.Query)(() => [UserNote_1.default])
    /**
   * Retrieves all the notes belonging to a specific user.
   *
   * @param {String} userId - The ID of the user whose notes are to be retrieved.
   * @return {Array} An array of user notes.
   */
    ,
    __param(0, (0, type_graphql_1.Arg)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserNotesResolver.prototype, "getAllMyNotes", null);
UserNotesResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], UserNotesResolver);
exports.default = UserNotesResolver;
