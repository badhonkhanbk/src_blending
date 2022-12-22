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
const CreateNewBlendNutrientCategory_1 = __importDefault(require("./input-type/blendNutrientCategory/CreateNewBlendNutrientCategory"));
const EditBlendNutrientCategory_1 = __importDefault(require("./input-type/blendNutrientCategory/EditBlendNutrientCategory"));
const BlendNutrientCategory_1 = __importDefault(require("../schemas/BlendNutrientCategory"));
const blendNutrientCategory_1 = __importDefault(require("../../../models/blendNutrientCategory"));
let BlendNutrientCategoryResolver = class BlendNutrientCategoryResolver {
    async addNewBlendNutrientCategory(data) {
        let blendNutrient = await blendNutrientCategory_1.default.create(data);
        return 'BlendNutrient Created Successfull';
    }
    async getAllBlendNutrientCategories() {
        let blendNutrientCategories = await blendNutrientCategory_1.default.find();
        return blendNutrientCategories;
    }
    async getASingleBlendNutrientCategory(id) {
        let blendNutrientCategory = await blendNutrientCategory_1.default.findOne({
            _id: id,
        });
        return blendNutrientCategory;
    }
    async deleteBlendNutrientCategory(id) {
        await blendNutrientCategory_1.default.findByIdAndDelete(id);
        return 'BlendNutrient Category Deleted';
    }
    async updateBlendNutrientCategory(data) {
        let blendNutrientCategory = await blendNutrientCategory_1.default.findByIdAndUpdate(data.editId, data.editableObject);
        return 'BlendNutrient Category Updated';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateNewBlendNutrientCategory_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientCategoryResolver.prototype, "addNewBlendNutrientCategory", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendNutrientCategory_1.default]) // ADMIN
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], BlendNutrientCategoryResolver.prototype, "getAllBlendNutrientCategories", null);
__decorate([
    (0, type_graphql_1.Query)(() => BlendNutrientCategory_1.default) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientCategoryResolver.prototype, "getASingleBlendNutrientCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], BlendNutrientCategoryResolver.prototype, "deleteBlendNutrientCategory", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String) //ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditBlendNutrientCategory_1.default]),
    __metadata("design:returntype", Promise)
], BlendNutrientCategoryResolver.prototype, "updateBlendNutrientCategory", null);
BlendNutrientCategoryResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], BlendNutrientCategoryResolver);
exports.default = BlendNutrientCategoryResolver;
