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
const mongoose_1 = __importDefault(require("mongoose"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const adminCollection_1 = __importDefault(require("../../../models/adminCollection"));
const CreateAdminCollection_1 = __importDefault(require("./input-type/CreateAdminCollection"));
const EditAdminCollection_1 = __importDefault(require("./input-type/EditAdminCollection"));
const EditChildren_1 = __importDefault(require("./input-type/EditChildren"));
const AdminCollection_1 = __importDefault(require("./schemas/AdminCollection"));
const SimpleAdminCollection_1 = __importDefault(require("./schemas/SimpleAdminCollection"));
const GenericModel_1 = __importDefault(require("../../../utils/GenericModel"));
const Widget_1 = __importDefault(require("../../../models/Widget"));
let AdminCollectionResolver = class AdminCollectionResolver {
    async addNewAdminCollection(data) {
        let adminCollection = await adminCollection_1.default.create(data);
        return adminCollection;
    }
    async editAdminCollectionByID(data) {
        const collection = await adminCollection_1.default.findById(data.editId);
        if (!collection) {
            throw new Error('Collection not found');
        }
        let newAdminCollection = await adminCollection_1.default.findByIdAndUpdate(data.editId, data.editableObject, {
            new: true,
        });
        return newAdminCollection;
    }
    async editChildrenInCollection(data) {
        let adminCollection = await adminCollection_1.default.findById(data.adminCollectionId);
        let Model = (0, GenericModel_1.default)(adminCollection.collectionType);
        if (Model === null) {
            // has to be fixed
            return new AppError_1.default(`Collection Type Is Not Correct : Available Collection are ${[
                'Recipe',
                'Ingredient',
                'Wiki',
                'GeneraBlog',
                'Plan',
                'Nutrient',
            ].join(', ')}`, 404);
        }
        if (data.checked) {
            await adminCollection_1.default.updateOne({ _id: data.adminCollectionId }, { $addToSet: { children: data.children } });
            for (let i = 0; i < data.children.length; i++) {
                await Model.updateOne({ _id: data.children[i] }, { $addToSet: { collections: data.adminCollectionId } });
            }
        }
        else {
            await adminCollection_1.default.updateOne({ _id: data.adminCollectionId }, { $pullAll: { children: data.children } });
            for (let i = 0; i < data.children.length; i++) {
                await Model.updateOne({ _id: data.children[i] }, { $pull: { collections: adminCollection._id } });
            }
        }
        let newAdminCollection = await adminCollection_1.default.findById(data.adminCollectionId);
        return newAdminCollection;
    }
    // @Query(() => [String])
    // async getChilderenFromAcollection(@Arg('collectionId') collectionId: string) {
    //   const collection = await AdminCollectionModel.findById(
    //     collectionId
    //   ).populate('children');
    //   if (!collection) {
    //     throw new AppError('Collection not found', 404);
    //   }
    //   return collection.children;
    // }
    async removeAdminCollection(collectionId) {
        const collection = await adminCollection_1.default.findById(collectionId);
        if (!collection) {
            throw new Error('Collection not found');
        }
        let Model = (0, GenericModel_1.default)(collection.collectionType);
        if (Model === null) {
            // has to be fixed
            return new AppError_1.default(`Collection Type Is Not Correct : Available Collection are ${[
                'Recipe',
                'Ingredient',
                'Wiki',
                'GeneraBlog',
                'Plan',
                'Nutrient',
            ].join(', ')}`, 404);
        }
        let widget = await Widget_1.default.findOne({
            'widgetCollections.collectionData': collection._id,
        }).select('_id');
        if (widget) {
            return new AppError_1.default('Collection is in used', 401);
        }
        for (let i = 0; i < collection.children.length; i++) {
            await Model.updateOne({ _id: collection.children[i] }, { $pull: { collections: collection._id } });
        }
        await Widget_1.default.updateMany({}, {
            $pull: {
                widgetCollections: {
                    collectionData: collection._id,
                },
            },
        });
        await Widget_1.default.updateMany({ 'widgetCollections.collectionData': collection._id }, { $pull: { 'widgetCollections.$.collectionData': collection._id } });
        await adminCollection_1.default.findByIdAndDelete(collectionId);
        return collectionId;
    }
    async getAllAdminCollection(collectionType) {
        const collections = await adminCollection_1.default.find({
            collectionType: collectionType,
        });
        return collections;
    }
    async getSimpleAdminCollections() {
        const collections = await adminCollection_1.default.find({}).select('_id collectionType name');
        return collections;
    }
    async getAllAdminCollectionType() {
        return ['Recipe', 'Ingredient', 'Wiki', 'GeneralBlog', 'Plan', 'Nutrient'];
    }
    async emptyCollections(collectionType) {
        await Widget_1.default.updateMany({}, {
            $pull: {
                widgetCollections: {
                    collectionData: new mongoose_1.default.mongo.ObjectId(collectionType),
                },
            },
        });
        return 'Collection deleted successfully';
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminCollection_1.default) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateAdminCollection_1.default]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "addNewAdminCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminCollection_1.default) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditAdminCollection_1.default]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "editAdminCollectionByID", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => AdminCollection_1.default) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditChildren_1.default]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "editChildrenInCollection", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('collectionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "removeAdminCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [AdminCollection_1.default]) // admin
    ,
    __param(0, (0, type_graphql_1.Arg)('collectionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "getAllAdminCollection", null);
__decorate([
    (0, type_graphql_1.Query)(() => [SimpleAdminCollection_1.default]) // admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "getSimpleAdminCollections", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]) // admin
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "getAllAdminCollectionType", null);
__decorate([
    (0, type_graphql_1.Query)(() => String) //admin
    ,
    __param(0, (0, type_graphql_1.Arg)('collectionType')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AdminCollectionResolver.prototype, "emptyCollections", null);
AdminCollectionResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], AdminCollectionResolver);
exports.default = AdminCollectionResolver;
