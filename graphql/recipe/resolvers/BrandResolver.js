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
const CreateRecipeBrand_1 = __importDefault(require("./input-type/CreateRecipeBrand"));
const EditBrand_1 = __importDefault(require("./input-type/EditBrand"));
const Brand_1 = __importDefault(require("../schemas/Brand"));
const brand_1 = __importDefault(require("../../../models/brand"));
let BrandResolver = class BrandResolver {
    /**
     * Retrieves all brands from the database and returns them.
     *
     * @return {Promise<Array<BrandModel>>} An array of BrandModel objects representing all the brands in the database.
     */
    async getAllBrands() {
        let brands = await brand_1.default.find().sort({ order: 1 });
        return brands;
    }
    /**
     * Retrieves a single brand by its ID.
     *
     * @param {string} brandId - The ID of the brand.
     * @return {Promise<Brand>} - The brand object.
     */
    async getASingleBrand(brandId) {
        let brand = await brand_1.default.findById(brandId);
        return brand;
    }
    /**
     * Creates a brand with the provided data.
     *
     * @param {CreateBrand} data - The data for creating the brand.
     * @return {Promise<string>} A string indicating the success of the brand creation.
     */
    async createBrand(data) {
        let brands = await brand_1.default.find().select('_id');
        let newData = data;
        newData.order = brands.length + 1;
        let newBrand = await brand_1.default.create(newData);
        return 'new brand created successfully';
    }
    /**
     * Edits a recipe brand.
     *
     * @param {EditBrand} data - The data for editing the brand.
     * @return {Promise<string>} - A success message indicating that the brand was updated successfully.
     */
    async editARecipeBrand(data) {
        let brand = await brand_1.default.findByIdAndUpdate(data.editId, data.editableObject, { new: true });
        return 'brand updated successfully';
    }
    /**
     * Deletes a recipe brand.
     *
     * @param {string} brandId - The ID of the brand to be deleted.
     * @return {Promise<string>} - A promise that resolves to a string indicating the success of the deletion.
     */
    async deleteARecipeBrand(brandId) {
        await brand_1.default.findByIdAndDelete(brandId);
        return 'brand deleted successfully';
    }
    /**
     * Orders the recipe brand based on the given data array.
     *
     * @param {String[]} data - An array of strings representing brand IDs.
     * @return {string} - A string indicating the success of the operation.
     */
    async orderingRecipeBrand(data) {
        for (let i = 0; i < data.length; i++) {
            await brand_1.default.findByIdAndUpdate(data[i], {
                order: i + 1,
            });
        }
        return 'Recipe Brand Ordered';
    }
    /**
     * Sets the order for the brand of each recipe.
     *
     * @return {string} The message indicating that the recipe brand has been ordered.
     */
    async setOrderBrand() {
        let brands = await brand_1.default.find().select('_id');
        for (let i = 0; i < brands.length; i++) {
            await brand_1.default.findByIdAndUpdate(brands[i], {
                order: i + 1,
            });
        }
        return 'Recipe Brand Ordered';
    }
};
__decorate([
    (0, type_graphql_1.Query)((type) => [Brand_1.default])
    /**
     * Retrieves all brands from the database and returns them.
     *
     * @return {Promise<Array<BrandModel>>} An array of BrandModel objects representing all the brands in the database.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "getAllBrands", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Brand_1.default)
    /**
     * Retrieves a single brand by its ID.
     *
     * @param {string} brandId - The ID of the brand.
     * @return {Promise<Brand>} - The brand object.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "getASingleBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Creates a brand with the provided data.
     *
     * @param {CreateBrand} data - The data for creating the brand.
     * @return {Promise<string>} A string indicating the success of the brand creation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipeBrand_1.default]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "createBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Edits a recipe brand.
     *
     * @param {EditBrand} data - The data for editing the brand.
     * @return {Promise<string>} - A success message indicating that the brand was updated successfully.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBrand_1.default]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "editARecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Deletes a recipe brand.
     *
     * @param {string} brandId - The ID of the brand to be deleted.
     * @return {Promise<string>} - A promise that resolves to a string indicating the success of the deletion.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "deleteARecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Orders the recipe brand based on the given data array.
     *
     * @param {String[]} data - An array of strings representing brand IDs.
     * @return {string} - A string indicating the success of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "orderingRecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Sets the order for the brand of each recipe.
     *
     * @return {string} The message indicating that the recipe brand has been ordered.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "setOrderBrand", null);
BrandResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BrandResolver);
exports.default = BrandResolver;
