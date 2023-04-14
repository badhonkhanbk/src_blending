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
let QAResolver = class QAResolver {
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
        return QAData;
    }
    async removeAllQA() {
        await QANotFound_1.default.deleteMany({});
        return 'All QA Removed';
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => [QAForAdmin_1.default]),
    __param(0, (0, type_graphql_1.Arg)('page', { nullable: true })),
    __param(1, (0, type_graphql_1.Arg)('limit', { nullable: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Number, Number]),
    __metadata("design:returntype", Promise)
], QAResolver.prototype, "getAllQAData", null);
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
