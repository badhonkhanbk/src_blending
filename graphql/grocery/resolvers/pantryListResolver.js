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
const CreatePantryList_1 = __importDefault(require("./input-type/CreatePantryList"));
const GroceryList_1 = __importDefault(require("../schemas/GroceryList"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const pantryList_1 = __importDefault(require("../../../models/pantryList"));
const StapleList_1 = __importDefault(require("../../../models/StapleList"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const checkGroceryList_1 = __importDefault(require("../util/checkGroceryList"));
let PantryResolver = class PantryResolver {
    /**
     * Adds a pantry list.
     *
     * @param {CreateNewPantry} data - the data for creating a new pantry
     * @return {Promise<string>} - a message indicating if the pantry list was successfully added
     */
    async addPantryList(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let model;
        if (data.isStaple) {
            model = StapleList_1.default;
        }
        else {
            model = pantryList_1.default;
        }
        let groceryList = await model.findOne({
            memberId: data.memberId,
        });
        if (!groceryList) {
            groceryList = await model.create({
                memberId: data.memberId,
                list: [],
            });
        }
        await (0, checkGroceryList_1.default)(data, model, groceryList);
        return 'Successfully added to pantry list';
    }
    /**
     * Retrieves the pantry list for a given member ID.
     *
     * @param {string} memberId - The ID of the member.
     * @return {Promise<Array>} - The pantry list as an array of ingredients.
     */
    async getPantryList(memberId) {
        let pantrtyList = await pantryList_1.default.findOne({
            memberId: memberId,
        });
        if (!pantrtyList) {
            pantrtyList = await pantryList_1.default.create({
                memberId: memberId,
                list: [],
            });
            return pantrtyList;
        }
        let pantryList = await pantryList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName portions featuredImage',
        });
        return pantryList.list;
    }
    /**
     * Retrieves the staple list for a given member.
     *
     * @param {string} memberId - The ID of the member.
     * @return {Promise<Array>} An array of staple items.
     */
    async getStapleList(memberId) {
        let pantrtyList = await StapleList_1.default.findOne({
            memberId: memberId,
        });
        if (!pantrtyList) {
            pantrtyList = await StapleList_1.default.create({
                memberId: memberId,
                list: [],
            });
            return pantrtyList;
        }
        let pantryList = await StapleList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName portions featuredImage',
        });
        return pantryList.list;
    }
    /**
     * Removes all pantry and staple lists.
     *
     * @return {Promise<string>} Returns 'done' when completed.
     */
    async removeAllPantryAndStapleList() {
        await pantryList_1.default.deleteMany();
        await StapleList_1.default.deleteMany();
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePantryList_1.default]),
    __metadata("design:returntype", Promise)
], PantryResolver.prototype, "addPantryList", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GroceryList_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PantryResolver.prototype, "getPantryList", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GroceryList_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], PantryResolver.prototype, "getStapleList", null);
__decorate([
    (0, type_graphql_1.Query)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], PantryResolver.prototype, "removeAllPantryAndStapleList", null);
PantryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PantryResolver);
exports.default = PantryResolver;
