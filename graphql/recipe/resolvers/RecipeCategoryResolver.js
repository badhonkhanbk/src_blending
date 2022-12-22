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
const CreateRecipeCategory_1 = __importDefault(require("./input-type/CreateRecipeCategory"));
const EditRecipeCategory_1 = __importDefault(require("./input-type/EditRecipeCategory"));
const RecipeCategory_1 = __importDefault(require("../schemas/RecipeCategory"));
const recipeCategory_1 = __importDefault(require("../../../models/recipeCategory"));
let RecipeCategoryResolver = class RecipeCategoryResolver {
    async getAllCategories() {
        let recipeCategories = await recipeCategory_1.default.find().sort({
            order: 1,
        });
        return recipeCategories;
    }
    async getASingleCategory(recipeCategoryName) {
        console.log('hello');
        let recipeCategory = await recipeCategory_1.default.findOne({
            name: recipeCategoryName,
        });
        return recipeCategory;
    }
    async orderingRecipeCategory(data) {
        for (let i = 0; i < data.length; i++) {
            await recipeCategory_1.default.findByIdAndUpdate(data[i], {
                order: i + 1,
            });
        }
        return 'Recipe Category Ordered';
    }
    async createRecipeCategory(data) {
        let categories = await recipeCategory_1.default.find().select('_id');
        let newData = data;
        newData.order = categories.length + 1;
        let newRecipeCategory = await recipeCategory_1.default.create(newData);
        return 'recipeCategrory Created Successfull';
    }
    async deleteRecipeCategory(recipeCategoryId) {
        await recipeCategory_1.default.findByIdAndDelete(recipeCategoryId);
        return 'Recipe Category Deleted';
    }
    async updateRecipeCategory(data) {
        let recipeCategory = await recipeCategory_1.default.findByIdAndUpdate(data.editId, data.editableObject);
        return 'Recipe Category Updated';
    }
    async setOrder() {
        let recipeCategories = await recipeCategory_1.default.find();
        for (let i = 0; i < recipeCategories.length; i++) {
            await recipeCategory_1.default.findByIdAndUpdate(recipeCategories[i]._id, {
                order: i + 1,
            });
        }
        return 'Order Set';
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => [RecipeCategory_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "getAllCategories", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipeCategory_1.default),
    __param(0, (0, type_graphql_1.Arg)('recipeCategoryName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "getASingleCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "orderingRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipeCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "createRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('recipeCategoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "deleteRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditRecipeCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "updateRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "setOrder", null);
RecipeCategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCategoryResolver);
exports.default = RecipeCategoryResolver;
