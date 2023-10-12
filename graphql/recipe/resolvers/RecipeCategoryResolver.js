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
    /**
     * Retrieves all categories from the database.
     *
     * @return {Promise<RecipeCategory[]>} An array of recipe categories.
     */
    async getAllCategories() {
        let recipeCategories = await recipeCategory_1.default.find().sort({
            order: 1,
        });
        return recipeCategories;
    }
    /**
     * Retrieves a single category based on the provided recipe category name.
     *
     * @param {string} recipeCategoryName - The name of the recipe category.
     * @return {Promise<RecipeCategory | null>} The retrieved recipe category.
     */
    async getASingleCategory(recipeCategoryName) {
        // console.log('hello');
        let recipeCategory = await recipeCategory_1.default.findOne({
            name: recipeCategoryName,
        });
        return recipeCategory;
    }
    /**
     * Orders the recipe category.
     *
     * @param {Array<string>} data - An array of strings representing the data to be ordered.
     * @return {string} - A string indicating the success of the ordering process.
     */
    async orderingRecipeCategory(data) {
        for (let i = 0; i < data.length; i++) {
            await recipeCategory_1.default.findByIdAndUpdate(data[i], {
                order: i + 1,
            });
        }
        return 'Recipe Category Ordered';
    }
    /**
     * Create a recipe category.
     *
     * @param {CreateRecipeCategory} data - The data for creating the recipe category.
     * @return {Promise<string>} - A success message indicating that the recipe category was created.
     */
    async createRecipeCategory(data) {
        let categories = await recipeCategory_1.default.find().select('_id');
        let newData = data;
        newData.order = categories.length + 1;
        let newRecipeCategory = await recipeCategory_1.default.create(newData);
        return 'recipeCategrory Created Successfull';
    }
    /**
     * Delete a recipe category.
     *
     * @param {string} recipeCategoryId - The ID of the recipe category to be deleted.
     * @return {Promise<string>} - A promise that resolves to the message "Recipe Category Deleted" upon successful deletion.
     */
    async deleteRecipeCategory(recipeCategoryId) {
        await recipeCategory_1.default.findByIdAndDelete(recipeCategoryId);
        return 'Recipe Category Deleted';
    }
    /**
     * Updates a recipe category.
     *
     * @param {EditRecipeCategory} data - The data to update the recipe category.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the update.
     */
    async updateRecipeCategory(data) {
        let recipeCategory = await recipeCategory_1.default.findByIdAndUpdate(data.editId, data.editableObject);
        return 'Recipe Category Updated';
    }
    /**
     * Sets the order of the recipe categories.
     *
     * @return {string} The message indicating that the order has been set.
     */
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
    (0, type_graphql_1.Query)((type) => [RecipeCategory_1.default])
    /**
     * Retrieves all categories from the database.
     *
     * @return {Promise<RecipeCategory[]>} An array of recipe categories.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "getAllCategories", null);
__decorate([
    (0, type_graphql_1.Query)((type) => RecipeCategory_1.default)
    /**
     * Retrieves a single category based on the provided recipe category name.
     *
     * @param {string} recipeCategoryName - The name of the recipe category.
     * @return {Promise<RecipeCategory | null>} The retrieved recipe category.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeCategoryName')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "getASingleCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Orders the recipe category.
     *
     * @param {Array<string>} data - An array of strings representing the data to be ordered.
     * @return {string} - A string indicating the success of the ordering process.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "orderingRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Create a recipe category.
     *
     * @param {CreateRecipeCategory} data - The data for creating the recipe category.
     * @return {Promise<string>} - A success message indicating that the recipe category was created.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipeCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "createRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Delete a recipe category.
     *
     * @param {string} recipeCategoryId - The ID of the recipe category to be deleted.
     * @return {Promise<string>} - A promise that resolves to the message "Recipe Category Deleted" upon successful deletion.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('recipeCategoryId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "deleteRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Updates a recipe category.
     *
     * @param {EditRecipeCategory} data - The data to update the recipe category.
     * @return {Promise<string>} A promise that resolves to a string indicating the success of the update.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditRecipeCategory_1.default]),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "updateRecipeCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Sets the order of the recipe categories.
     *
     * @return {string} The message indicating that the order has been set.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], RecipeCategoryResolver.prototype, "setOrder", null);
RecipeCategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], RecipeCategoryResolver);
exports.default = RecipeCategoryResolver;
