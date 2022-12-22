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
    async getAllBrands() {
        let brands = await brand_1.default.find().sort({ order: 1 });
        return brands;
    }
    async getASingleBrand(brandId) {
        let brand = await brand_1.default.findById(brandId);
        return brand;
    }
    async createBrand(data) {
        let brands = await brand_1.default.find().select('_id');
        let newData = data;
        newData.order = brands.length + 1;
        let newBrand = await brand_1.default.create(newData);
        return 'new brand created successfully';
    }
    async editARecipeBrand(data) {
        let brand = await brand_1.default.findByIdAndUpdate(data.editId, data.editableObject, { new: true });
        return 'brand updated successfully';
    }
    async deleteARecipeBrand(brandId) {
        await brand_1.default.findByIdAndDelete(brandId);
        return 'brand deleted successfully';
    }
    async orderingRecipeBrand(data) {
        for (let i = 0; i < data.length; i++) {
            await brand_1.default.findByIdAndUpdate(data[i], {
                order: i + 1,
            });
        }
        return 'Recipe Brand Ordered';
    }
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
    (0, type_graphql_1.Query)((type) => [Brand_1.default]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "getAllBrands", null);
__decorate([
    (0, type_graphql_1.Query)((type) => Brand_1.default),
    __param(0, (0, type_graphql_1.Arg)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "getASingleBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateRecipeBrand_1.default]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "createBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBrand_1.default]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "editARecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('brandId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "deleteARecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('data', (type) => [String])),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "orderingRecipeBrand", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BrandResolver.prototype, "setOrderBrand", null);
BrandResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BrandResolver);
exports.default = BrandResolver;
