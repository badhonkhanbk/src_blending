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
const CreateNewGroceries_1 = __importDefault(require("./input-type/CreateNewGroceries"));
const GroceryList_1 = __importDefault(require("../schemas/GroceryList"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const GroceryList_2 = __importDefault(require("../../../models/GroceryList"));
const GroceryIngredientType_1 = __importDefault(require("../schemas/GroceryIngredientType"));
const pantryList_1 = __importDefault(require("../../../models/pantryList"));
const StapleList_1 = __importDefault(require("../../../models/StapleList"));
const GroceryIngredient_1 = __importDefault(require("./input-type/GroceryIngredient"));
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const checkGroceryList_1 = __importDefault(require("../util/checkGroceryList"));
let GroceryResolver = class GroceryResolver {
    async addGroceryList(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let groceryList = await GroceryList_2.default.findOne({
            memberId: data.memberId,
        });
        if (!groceryList) {
            groceryList = await GroceryList_2.default.create({
                memberId: data.memberId,
                list: [],
            });
        }
        await (0, checkGroceryList_1.default)(data, GroceryList_2.default, groceryList);
        return 'true';
    }
    async getMyGroceryList(memberId) {
        let foundGrocery = await GroceryList_2.default.findOne({
            memberId: memberId,
        });
        if (!foundGrocery) {
            let groceryList = await GroceryList_2.default.findOne({
                memberId: memberId,
                list: [],
            });
            return groceryList;
        }
        let groceryList = await GroceryList_2.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: 'ingredientName portions featuredImage',
        });
        return groceryList.list;
    }
    async deleteSomeFromList(groceryIngredients, pantryIngredients, stapleIngredients, memberId) {
        await GroceryList_2.default.findOneAndUpdate({
            memberId: memberId,
        }, {
            $pull: {
                list: {
                    ingredientId: { $in: groceryIngredients },
                },
            },
        });
        await pantryList_1.default.findOneAndUpdate({
            memberId: memberId,
        }, {
            $pull: {
                list: {
                    ingredientId: { $in: pantryIngredients },
                },
            },
        });
        await StapleList_1.default.findOneAndUpdate({
            memberId: memberId,
        }, {
            $pull: {
                list: {
                    ingredientId: { $in: stapleIngredients },
                },
            },
        });
        return 'successfully deleted';
    }
    async editAListItem(ingredient, memberId, listType) {
        let model;
        if (listType === 'Grocery') {
            model = GroceryList_2.default;
        }
        else if (listType === 'Pantry') {
            model = pantryList_1.default;
        }
        else {
            model = StapleList_1.default;
        }
        let data = {};
        data.ingredients = [ingredient];
        let groceryList = await model.findOne({
            memberId: memberId,
        });
        if (!groceryList) {
            groceryList = await model.create({
                memberId: memberId,
                list: [],
            });
        }
        await model.findOneAndUpdate({
            _id: groceryList._id,
        }, {
            $pull: {
                list: new mongoose_1.default.Types.ObjectId(ingredient.ingredientId.toString()),
            },
        });
        await (0, checkGroceryList_1.default)(data, model, groceryList);
        return 'Successfully updated';
    }
    async searchBlendIngredientsForGrocery(searchTerm, memberId) {
        let goceryListForThis = await GroceryList_2.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list1 = goceryListForThis.list.map((data) => String(data.ingredientId._id));
        let pantryListForThis = await pantryList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list2 = pantryListForThis.list.map((data) => String(data.ingredientId._id));
        let stapleListForThis = await StapleList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list3 = stapleListForThis.list.map((data) => String(data.ingredientId._id));
        let finalList = list1.concat(list2.concat(list3));
        let ingredients = await blendIngredient_1.default.find({
            _id: { $nin: finalList },
            ingredientName: { $regex: searchTerm, $options: 'i' },
        })
            .select('ingredientName portions featuredImage')
            .sort({ ingredientName: 1 });
        return ingredients;
    }
    async getMyIngredientList(memberId) {
        let goceryListForThis = await GroceryList_2.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list1 = goceryListForThis.list.map((data) => String(data.ingredientId._id));
        let pantryListForThis = await pantryList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list2 = pantryListForThis.list.map((data) => String(data.ingredientId._id));
        let stapleListForThis = await StapleList_1.default.findOne({
            memberId: memberId,
        }).populate({
            path: 'list.ingredientId',
            model: 'BlendIngredient',
            select: '_id',
        });
        //@ts-ignore
        let list3 = stapleListForThis.list.map((data) => String(data.ingredientId._id));
        let finalList = list1.concat(list2.concat(list3));
        return finalList;
    }
    async removeAllGroceryList() {
        await GroceryList_2.default.deleteMany();
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewGroceries_1.default]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "addGroceryList", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GroceryList_1.default]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "getMyGroceryList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('groceryIngredients', (type) => [type_graphql_1.ID])),
    __param(1, (0, type_graphql_1.Arg)('pantryIngredients', (type) => [type_graphql_1.ID])),
    __param(2, (0, type_graphql_1.Arg)('stapleIngredients', (type) => [type_graphql_1.ID])),
    __param(3, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array, Array, Array, String]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "deleteSomeFromList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('ingredient')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __param(2, (0, type_graphql_1.Arg)('listType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [GroceryIngredient_1.default, String, String]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "editAListItem", null);
__decorate([
    (0, type_graphql_1.Query)(() => [GroceryIngredientType_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchTerm')),
    __param(1, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "searchBlendIngredientsForGrocery", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "getMyIngredientList", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], GroceryResolver.prototype, "removeAllGroceryList", null);
GroceryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], GroceryResolver);
exports.default = GroceryResolver;
