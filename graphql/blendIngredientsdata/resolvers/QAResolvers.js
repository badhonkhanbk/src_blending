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
const QANotFound_1 = __importDefault(require("../../../models/QANotFound"));
const QAForAdmin_1 = __importDefault(require("../schemas/QAForAdmin"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const blendIngredient_1 = __importDefault(require("../../../models/blendIngredient"));
const ingredient_1 = __importDefault(require("../../../models/ingredient"));
const AddBlendIngredient_1 = __importDefault(require("./input-type/AddBlendIngredient"));
const QAIngredientAndPercentage_1 = __importDefault(require("../schemas/QAIngredientAndPercentage"));
const addIngredientFromSrc_1 = __importDefault(require("./util/addIngredientFromSrc"));
const QAAdminWithPagination_1 = __importDefault(require("../schemas/QAAdminWithPagination"));
const mongoose_1 = __importDefault(require("mongoose"));
let QAResolver = class QAResolver {
    /**
     * Retrieves all QA data with pagination.
     *
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of items per page.
     * @returns {Object} An object containing QAData and totalData.
     */
    async getAllQAData(page, limit) {
        if (!page || page < 1) {
            page = 1;
        }
        if (!limit || limit < 1) {
            limit = 10;
        }
        let QAData = await QANotFound_1.default.find()
            .populate({
            path: 'matchedIngredients.ingredientId',
            select: 'ingredientName',
        })
            .populate({
            path: 'bestMatch',
            select: 'ingredientName',
        })
            .limit(limit)
            .skip(limit * (page - 1));
        console.log(QAData[9].versions);
        let totalData = await QANotFound_1.default.countDocuments();
        return {
            QAData: QAData,
            totalData: totalData,
        };
    }
    /**
     * Add a new best match to the Q&A.
     *
     * @param {String} ingredientId - The ID of the ingredient to add.
     * @param {String} qaId - The ID of the Q&A.
     * @param {Boolean} isBlend - Whether the ingredient is a blend or not.
     * @return {Object} The added best match.
     */
    async addToQABestMatches(ingredientId, qaId, isBlend) {
        let qa = await QANotFound_1.default.findOne({ _id: qaId }).select('name');
        if (!qa) {
            return new AppError_1.default('qa not found', 403);
        }
        let ingredient = {};
        if (isBlend) {
            ingredient = await blendIngredient_1.default.findOne({
                _id: ingredientId,
            }).select('ingredientName');
        }
        else {
            ingredient = await ingredient_1.default.findOne({
                _id: ingredientId,
            }).select('ingredientName');
        }
        if (!ingredient) {
            return new AppError_1.default('ingredient not fount', 403);
        }
        let percentage = await this.similar(ingredient.ingredientName, qa.name);
        if (isBlend) {
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $push: {
                    blendIngredients: {
                        ingredientId: ingredientId,
                        percentage: percentage,
                    },
                    matchedIngredients: {
                        ingredientId: ingredientId,
                        onModel: 'BlendIngredient',
                        percentage: percentage,
                    },
                },
                $inc: { bestMatchCounts: 1 },
            });
            return {
                ingredientId: {
                    _id: ingredientId,
                    ingredientName: ingredient.ingredientName,
                },
                percentage: percentage,
                onModel: 'BlendIngredient',
            };
        }
        else {
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $push: {
                    sourceIngredients: {
                        ingredientId: ingredientId,
                        percentage: percentage,
                    },
                    matchedIngredients: {
                        ingredientId: ingredientId,
                        onModel: 'Ingredient',
                        percentage: percentage,
                    },
                },
                $inc: { bestMatchCounts: 1 },
            });
            return {
                ingredientId: {
                    _id: ingredientId,
                    ingredientName: ingredient.ingredientName,
                },
                percentage: percentage,
                onModel: 'Ingredient',
            };
        }
    }
    /**
     * Remove an ingredient from the best matches in the QA collection.
     *
     * @param {String} ingredientId - The ID of the ingredient to be removed.
     * @param {String} qaId - The ID of the QA document.
     * @param {Boolean} isBlend - Indicates whether the ingredient is a blend or not.
     * @return {AppError|String} - The success message or an error if the ingredient or QA document is not found.
     */
    async removeFromQABestMatches(ingredientId, qaId, isBlend) {
        let qa = await QANotFound_1.default.findOne({ _id: qaId }).select('name');
        if (!qa) {
            return new AppError_1.default('qa not found', 403);
        }
        let ingredient = {};
        if (isBlend) {
            ingredient = await blendIngredient_1.default.findOne({
                _id: ingredientId,
            }).select('ingredientName');
        }
        else {
            ingredient = await ingredient_1.default.findOne({
                _id: ingredientId,
            }).select('ingredientName');
        }
        if (!ingredient) {
            return new AppError_1.default('ingredient not fount', 403);
        }
        if (isBlend) {
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $pull: {
                    blendIngredients: { ingredientId: ingredient._id },
                    matchedIngredients: { ingredientId: ingredient._id },
                },
                $inc: { bestMatchCounts: -1 },
            });
        }
        else {
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $pull: {
                    sourceIngredients: { ingredientId: ingredient._id },
                    matchedIngredients: { ingredientId: ingredient._id },
                },
                $inc: { bestMatchCounts: -1 },
            });
        }
        return 'remove from best Matches';
    }
    async addNewBlendIngredientWithQAId(blendIngredient, qaId) {
        let newBlendIngredient = await blendIngredient_1.default.create(blendIngredient);
        let qa = await QANotFound_1.default.findOne({ _id: qaId }).select('name');
        if (!qa) {
            return new AppError_1.default('qa not found', 403);
        }
        let percentage = await this.similar(newBlendIngredient.ingredientName, qa.name);
        await QANotFound_1.default.findOneAndUpdate({
            _id: qaId,
        }, {
            $push: {
                blendIngredients: {
                    ingredientId: newBlendIngredient._id,
                    percentage: percentage,
                },
                matchedIngredients: {
                    ingredientId: newBlendIngredient._id,
                    onModel: 'BlendIngredient',
                    percentage: percentage,
                },
            },
            $inc: { bestMatchCounts: 1 },
        });
        return {
            ingredientId: {
                _id: newBlendIngredient._id,
                ingredientName: newBlendIngredient.ingredientName,
            },
            percentage: percentage,
            onModel: 'BlendIngredient',
        };
    }
    /**
     * Selects an ingredient for a QA.
     *
     * @param {String} ingredientId - The ID of the ingredient.
     * @param {String} qaId - The ID of the QA.
     * @param {Boolean} isBlend - Indicates whether the ingredient is a blend.
     * @return {Promise<any>} The QA data with matched ingredients and best match.
     */
    async selectIngredientForAnQa(ingredientId, qaId, isBlend) {
        let qa = await QANotFound_1.default.findOne({ _id: qaId }).select('name');
        if (!qa) {
            return new AppError_1.default('qa not found', 403);
        }
        let ingredient = {};
        let status = '';
        if (isBlend) {
            ingredient = await blendIngredient_1.default.findOne({
                _id: ingredientId,
            }).select('ingredientName blendStatus');
            if (ingredient.blendStatus == 'New') {
                status = 'New';
            }
            else {
                status = 'Boarded';
            }
        }
        else {
            let blendIngredient = await blendIngredient_1.default.findOne({
                srcFoodReference: ingredientId,
            });
            if (blendIngredient) {
                ingredient = blendIngredient;
            }
            else {
                ingredient = await (0, addIngredientFromSrc_1.default)(ingredientId);
            }
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $push: {
                    blendIngredients: {
                        ingredientId: ingredient._id,
                        percentage: 100,
                    },
                    matchedIngredients: {
                        ingredientId: ingredient._id,
                        onModel: 'BlendIngredient',
                        percentage: 100,
                    },
                },
            });
            await QANotFound_1.default.findOneAndUpdate({
                _id: qaId,
            }, {
                $pull: {
                    sourceIngredients: {
                        ingredientId: new mongoose_1.default.Types.ObjectId(ingredientId.toString()),
                    },
                    matchedIngredients: {
                        ingredientId: new mongoose_1.default.Types.ObjectId(ingredientId.toString()),
                    },
                },
            });
            status = 'OnBoarded';
        }
        if (!ingredient) {
            return new AppError_1.default('ingredient not fount', 403);
        }
        await QANotFound_1.default.findOneAndUpdate({
            _id: qaId,
        }, {
            status: status,
            bestMatch: ingredient._id,
        });
        let QAData = await QANotFound_1.default.findOne({
            _id: qaId,
        })
            .populate({
            path: 'matchedIngredients.ingredientId',
            select: 'ingredientName',
        })
            .populate({
            path: 'bestMatch',
            select: 'ingredientName',
        });
        return QAData;
    }
    /**
     * Calculates the similarity between two arrays.
     *
     * @param {any[]} a - The first array.
     * @param {any[]} b - The second array.
     * @return {number} The similarity between the two arrays as a percentage.
     */
    async similar(a, b) {
        var equivalency = 0;
        var minLength = a.length > b.length ? b.length : a.length;
        var maxLength = a.length < b.length ? b.length : a.length;
        for (var i = 0; i < minLength; i++) {
            if (a[i] == b[i]) {
                equivalency++;
            }
        }
        var weight = equivalency / maxLength;
        return weight * 100;
    }
    async removeAllQA() {
        await QANotFound_1.default.deleteMany({});
        return 'All QA Removed';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => QAAdminWithPagination_1.default)
    /**
     * Retrieves all QA data with pagination.
     *
     * @param {number} page - The page number to retrieve.
     * @param {number} limit - The number of items per page.
     * @returns {Object} An object containing QAData and totalData.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "getAllQAData", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => QAIngredientAndPercentage_1.default)
    /**
     * Add a new best match to the Q&A.
     *
     * @param {String} ingredientId - The ID of the ingredient to add.
     * @param {String} qaId - The ID of the Q&A.
     * @param {Boolean} isBlend - Whether the ingredient is a blend or not.
     * @return {Object} The added best match.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __param(1, (0, type_graphql_1.Arg)('qaId')),
    __param(2, (0, type_graphql_1.Arg)('isBlend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "addToQABestMatches", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String)
    /**
     * Remove an ingredient from the best matches in the QA collection.
     *
     * @param {String} ingredientId - The ID of the ingredient to be removed.
     * @param {String} qaId - The ID of the QA document.
     * @param {Boolean} isBlend - Indicates whether the ingredient is a blend or not.
     * @return {AppError|String} - The success message or an error if the ingredient or QA document is not found.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __param(1, (0, type_graphql_1.Arg)('qaId')),
    __param(2, (0, type_graphql_1.Arg)('isBlend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "removeFromQABestMatches", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => QAIngredientAndPercentage_1.default) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('blendIngredient')),
    __param(1, (0, type_graphql_1.Arg)('qaId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AddBlendIngredient_1.default,
        String]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "addNewBlendIngredientWithQAId", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => QAForAdmin_1.default)
    /**
     * Selects an ingredient for a QA.
     *
     * @param {String} ingredientId - The ID of the ingredient.
     * @param {String} qaId - The ID of the QA.
     * @param {Boolean} isBlend - Indicates whether the ingredient is a blend.
     * @return {Promise<any>} The QA data with matched ingredients and best match.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('ingredientId')),
    __param(1, (0, type_graphql_1.Arg)('qaId')),
    __param(2, (0, type_graphql_1.Arg)('isBlend')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String,
        String,
        Boolean]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "selectIngredientForAnQa", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "removeAllQA", null);
QAResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], QAResolver);
exports.default = QAResolver;
