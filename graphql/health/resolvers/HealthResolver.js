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
const health_1 = __importDefault(require("../../../models/health"));
const HealthData_1 = __importDefault(require("../schema/HealthData"));
const AddNewHealthData_1 = __importDefault(require("./inputType/AddNewHealthData"));
const EditHealthData_1 = __importDefault(require("./inputType/EditHealthData"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const SimpleHealthData_1 = __importDefault(require("../schema/SimpleHealthData"));
const fs_1 = __importDefault(require("fs"));
let HeathResolver = class HeathResolver {
    async importDataFromCSV() {
        await health_1.default.deleteMany();
        let data = fs_1.default.readFileSync('./temp/dis.json', 'utf-8');
        data = JSON.parse(data);
        for (let i = 0; i < 102; i++) {
            let healthData = {
                healthTopic: data[i]['Acid Reflux (GERD)'],
                category: data[i]['Digestive Disorders'],
                foods: [],
                nutrients: [],
                images: [],
            };
            await health_1.default.create(healthData);
        }
        return 'Done';
    }
    async addNewHealthData(data) {
        let health = await health_1.default.create(data);
        return 'done';
    }
    async editHealthData(data) {
        let health = await health_1.default.findOne({ _id: data.editId });
        if (!health) {
            return new AppError_1.default('Health not found', 404);
        }
        let ModifiedHealth = await health_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject, {
            new: true,
        });
        return 'done';
    }
    async getASingleHealthData(healthId) {
        let health = await health_1.default.findOne({ _id: healthId })
            .populate({
            path: 'nutrients.nutrientId',
            model: 'BlendNutrient',
            populate: {
                path: 'category',
                model: 'BlendNutrientCategory',
            },
        })
            .populate({
            path: 'foods.foodId',
            model: 'BlendIngredient',
        })
            .lean();
        if (!health) {
            return new AppError_1.default('Health Not Found', 404);
        }
        return health;
    }
    async getAllHealthData(page, limit) {
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit || limit < 1) {
            limit = 10;
        }
        let healths = await health_1.default.find()
            .limit(limit)
            .skip(limit * (page - 1))
            .lean();
        return healths;
    }
    async deleteHealthData(healthId) {
        await health_1.default.findOneAndDelete({ _id: healthId });
        return 'Done';
    }
    async searchHealthData(searchText) {
        let healths = await health_1.default.find({
            healthTopic: { $regex: searchText, $options: 'i' },
        });
        return healths;
    }
    async updateAllHealthData() {
        await health_1.default.updateMany({}, {
            description: '',
            status: '',
            source: '',
        });
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "importDataFromCSV", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => HealthData_1.default),
    __param(0, (0, type_graphql_1.Arg)('addNewHealthData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewHealthData_1.default]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "addNewHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __param(0, (0, type_graphql_1.Arg)('EditHealthData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditHealthData_1.default]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "editHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => HealthData_1.default),
    __param(0, (0, type_graphql_1.Arg)('healthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getASingleHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleHealthData_1.default]),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getAllHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String),
    __param(0, (0, type_graphql_1.Arg)('healthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "deleteHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [HealthData_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchText')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "searchHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "updateAllHealthData", null);
HeathResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], HeathResolver);
exports.default = HeathResolver;
