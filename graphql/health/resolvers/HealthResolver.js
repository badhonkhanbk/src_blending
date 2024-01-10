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
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const blendNutrient_1 = __importDefault(require("../../../models/blendNutrient"));
const BlendNutrientData_1 = __importDefault(require("../../blendNutrient/schemas/BlendNutrientData"));
const BlendIngredientData_1 = __importDefault(require("../../blendIngredientsdata/schemas/BlendIngredientData"));
let HeathResolver = class HeathResolver {
    /**
     * Imports data from a CSV file.
     *
     * @return {Promise<string>} A string indicating the completion status of the import.
     */
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
    /**
     * Adds new health data.
     *
     * @param {AddNewHealthData} data - The health data to add.
     * @return {Promise<string>} - A string indicating the completion of the operation.
     */
    async addNewHealthData(data) {
        let health = await health_1.default.create(data);
        return 'done';
    }
    /**
     * Edits health data.
     *
     * @param {type} data - EditHealthData object containing the necessary data for editing health data.
     * @return {type} - The result of the edit operation, indicating if it was successful or not.
     */
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
    /**
     * Retrieves a single health data by its ID.
     *
     * @param {String} healthId - The ID of the health data to retrieve.
     * @return {Promise<Object>} - The retrieved health data.
     */
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
    /**
     * Retrieves all health data with pagination.
     *
     * @param {number} page - The page number to retrieve (nullable)
     * @param {number} limit - The maximum number of items per page (nullable)
     * @return {Promise<Health[]>} An array of health data
     */
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
    /**
     * Deletes the health data with the given healthId.
     *
     * @param {String} healthId - The ID of the health data to be deleted.
     * @return {String} Returns 'Done' if the deletion is successful.
     */
    async deleteHealthData(healthId) {
        await health_1.default.findOneAndDelete({ _id: healthId });
        return 'Done';
    }
    /**
     * Search health data based on the provided search text.
     *
     * @param {String} searchText - The search text to match against health topics.
     * @return {Promise<Array>} - A promise that resolves to an array of health data objects.
     */
    async searchHealthData(searchText) {
        let healths = await health_1.default.find({
            healthTopic: { $regex: searchText, $options: 'i' },
        });
        return healths;
    }
    /**
     * Updates all health data.
     *
     * @return {Promise<string>} Returns a promise that resolves to 'done'.
     */
    async updateAllHealthData() {
        await health_1.default.updateMany({}, {
            description: '',
            status: '',
            source: '',
        });
        return 'done';
    }
    /**
     * Adds a random ingredient and health value to the database.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the operation is complete.
     */
    async addRandomIngredientAndHealthValue() {
        let healthData = await health_1.default.find();
        let blendIngredients = await blendIngredient_1.default.find({});
        let blendNutrients = await blendNutrient_1.default.find({});
        for (let i = 0; i < healthData.length; i++) {
            console.log('master', i);
            let foods = [];
            let nutrients = [];
            for (let j = 0; j < 10; j++) {
                console.log('child', j);
                let randomIngredientIndex = Math.floor(Math.random() * blendIngredients.length);
                let randomScoreForIngredient = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
                let randomNutrientIndex = Math.floor(Math.random() * blendNutrients.length);
                console.log(randomIngredientIndex);
                console.log(randomNutrientIndex);
                let randomScoreForNutrient = Math.floor(Math.random() * (100 - 25 + 1)) + 25;
                foods.push({
                    foodId: blendIngredients[randomIngredientIndex]._id
                        ? blendIngredients[randomIngredientIndex]._id
                        : blendIngredients[i]._id,
                    score: randomScoreForIngredient,
                });
                nutrients.push({
                    nutrientId: blendNutrients[randomNutrientIndex]._id
                        ? blendNutrients[randomNutrientIndex]._id
                        : blendIngredients[0]._id,
                    score: randomScoreForNutrient,
                });
                // await HealthModel.findOneAndUpdate(
                //   {
                //     _id: healthData[i]._id,
                //   },
                //   {
                //     $push: {
                //       foods: {
                //         foodId: blendIngredients[randomIngredientIndex]._id,
                //         score: randomIngredientIndex,
                //       },
                //       nutrients: {
                //         nutrientId: blendNutrients[randomNutrientIndex]._id,
                //         score: randomScoreForNutrient,
                //       },
                //     },
                //   }
                // );
            }
            await health_1.default.findOneAndUpdate({
                _id: healthData[i]._id,
            }, {
                foods,
                nutrients,
            });
        }
        return 'done';
    }
    /**
     * Retrieves the remaining nutrients based on a health ID.
     *
     * @param {string} searchText - The text to search for in the nutrient name. Optional.
     * @param {string} healthId - The ID of the health data.
     * @return {Promise<any[]>} An array of remaining nutrients.
     */
    async getRemainingNutrientsByHealthId(searchText, healthId) {
        let find = {};
        if (searchText) {
            find['nutrientName'] = { $regex: searchText, $options: 'i' };
        }
        let healthData = await health_1.default.findOne({ _id: healthId });
        if (!healthId) {
            return new AppError_1.default('Health not found', 404);
        }
        let addedNutrients = healthData.nutrients;
        let addedNutrientsIds = addedNutrients.map((addedNutrient) => addedNutrient.nutrientId);
        if (addedNutrientsIds.length > 0) {
            find._id = { $nin: addedNutrientsIds };
        }
        let nutrients = await blendNutrient_1.default.find(find).populate('category').lean();
        return nutrients;
    }
    async getRemainingIngredientsByHealthId(searchText, healthId) {
        let find = {};
        if (searchText) {
            find['ingredientName'] = { $regex: searchText, $options: 'i' };
        }
        let healthData = await health_1.default.findOne({ _id: healthId });
        if (!healthId) {
            return new AppError_1.default('Health not found', 404);
        }
        let addedIngredients = healthData.foods;
        let addedIngredientIds = addedIngredients.map((addedIngredient) => addedIngredient.foodId);
        if (addedIngredientIds.length > 0) {
            find._id = { $nin: addedIngredientIds };
        }
        let ingredients = await blendIngredient_1.default.find(find)
            .populate('category')
            .lean();
        return ingredients;
    }
    /**
     * Resets the nutrients and foods for health.
     *
     * @return {Promise<string>} A string indicating the completion of the operation.
     */
    async resetNutrientAndFoodForHealth() {
        await health_1.default.updateMany({}, { foods: [], nutrients: [] });
        return 'done';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Imports data from a CSV file.
     *
     * @return {Promise<string>} A string indicating the completion status of the import.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "importDataFromCSV", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => HealthData_1.default)
    /**
     * Adds new health data.
     *
     * @param {AddNewHealthData} data - The health data to add.
     * @return {Promise<string>} - A string indicating the completion of the operation.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('addNewHealthData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddNewHealthData_1.default]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "addNewHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Edits health data.
     *
     * @param {type} data - EditHealthData object containing the necessary data for editing health data.
     * @return {type} - The result of the edit operation, indicating if it was successful or not.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('EditHealthData')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditHealthData_1.default]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "editHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => HealthData_1.default)
    /**
     * Retrieves a single health data by its ID.
     *
     * @param {String} healthId - The ID of the health data to retrieve.
     * @return {Promise<Object>} - The retrieved health data.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('healthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getASingleHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleHealthData_1.default])
    /**
     * Retrieves all health data with pagination.
     *
     * @param {number} page - The page number to retrieve (nullable)
     * @param {number} limit - The maximum number of items per page (nullable)
     * @return {Promise<Health[]>} An array of health data
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getAllHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)((type) => String)
    /**
     * Deletes the health data with the given healthId.
     *
     * @param {String} healthId - The ID of the health data to be deleted.
     * @return {String} Returns 'Done' if the deletion is successful.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('healthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "deleteHealthData", null);
__decorate([
    (0, type_graphql_1.Query)(() => [HealthData_1.default])
    /**
     * Search health data based on the provided search text.
     *
     * @param {String} searchText - The search text to match against health topics.
     * @return {Promise<Array>} - A promise that resolves to an array of health data objects.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('searchText')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "searchHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Updates all health data.
     *
     * @return {Promise<string>} Returns a promise that resolves to 'done'.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "updateAllHealthData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Adds a random ingredient and health value to the database.
     *
     * @return {Promise<string>} A promise that resolves to 'done' when the operation is complete.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "addRandomIngredientAndHealthValue", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendNutrientData_1.default])
    /**
     * Retrieves the remaining nutrients based on a health ID.
     *
     * @param {string} searchText - The text to search for in the nutrient name. Optional.
     * @param {string} healthId - The ID of the health data.
     * @return {Promise<any[]>} An array of remaining nutrients.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('searchText', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('HealthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getRemainingNutrientsByHealthId", null);
__decorate([
    (0, type_graphql_1.Query)(() => [BlendIngredientData_1.default]),
    __param(0, (0, type_graphql_1.Arg)('searchText', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('HealthId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "getRemainingIngredientsByHealthId", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Resets the nutrients and foods for health.
     *
     * @return {Promise<string>} A string indicating the completion of the operation.
     */
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], HeathResolver.prototype, "resetNutrientAndFoodForHealth", null);
HeathResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], HeathResolver);
exports.default = HeathResolver;
