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
const memberConfiguiration_1 = __importDefault(require("../../../models/memberConfiguiration"));
const EditConfiguiration_1 = __importDefault(require("./input-type/EditConfiguiration"));
const Configuiration_1 = __importDefault(require("../schemas/Configuiration"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
let ConfiguirationResolver = class ConfiguirationResolver {
    async getASingleCofiguiration(configuirationId) {
        let config = await memberConfiguiration_1.default.findOne({ _id: configuirationId });
        return config;
    }
    async getAllConfiguirations() {
        let configs = await memberConfiguiration_1.default.find();
        return configs;
    }
    async removeAconfiguirationById(configuirationId) {
        await memberConfiguiration_1.default.findByIdAndRemove(configuirationId);
        return 'successfullRemoved';
    }
    async editConfifuirationById(data) {
        let newData = data.editableObject;
        let hasGender = data.editableObject.gender && newData.gender !== '';
        let hasWeightInKilograms = data.editableObject.weightInKilograms
            ? true
            : false;
        let hasHeightInCentimeters = data.editableObject.heightInCentimeters
            ? true
            : false;
        let hasAge = data.editableObject.age.quantity ? true : false;
        if (hasHeightInCentimeters && hasAge && hasWeightInKilograms && hasGender) {
            await memberModel_1.default.findOneAndUpdate({ configuration: data.editId }, {
                isCreated: true,
            });
        }
        else {
            await memberModel_1.default.findOneAndUpdate({ configuration: data.editId }, {
                isCreated: false,
            });
        }
        await memberConfiguiration_1.default.findOneAndUpdate({ _id: data.editId }, data.editableObject);
        return 'Success';
    }
    async checkConfiguiration() {
        let configs = await memberConfiguiration_1.default.find();
        for (let i = 0; i < configs.length; i++) {
            let hasGender = configs[i].gender && configs[i].gender !== '';
            let hasWeightInKilograms = configs[i].weightInKilograms ? true : false;
            let hasHeightInCentimeters = configs[i].heightInCentimeters
                ? true
                : false;
            let hasAge = configs[i].age.quantity ? true : false;
            if (hasHeightInCentimeters &&
                hasAge &&
                hasWeightInKilograms &&
                hasGender) {
                await memberModel_1.default.findOneAndUpdate({ configuration: configs[i]._id }, {
                    isCreated: true,
                });
            }
            else {
                await memberModel_1.default.findOneAndUpdate({ configuration: configs[i]._id }, {
                    isCreated: false,
                });
            }
        }
        return ['hello', 'world'];
    }
};
__decorate([
    (0, type_graphql_1.Query)(() => Configuiration_1.default) // CLIENT
    ,
    __param(0, (0, type_graphql_1.Arg)('configuirationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfiguirationResolver.prototype, "getASingleCofiguiration", null);
__decorate([
    (0, type_graphql_1.Query)(() => [Configuiration_1.default]) // NO NEED TO USE THIS METHOD
    ,
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguirationResolver.prototype, "getAllConfiguirations", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('configuirationId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ConfiguirationResolver.prototype, "removeAconfiguirationById", null);
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // ADMIN
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [EditConfiguiration_1.default]),
    __metadata("design:returntype", Promise)
], ConfiguirationResolver.prototype, "editConfifuirationById", null);
__decorate([
    (0, type_graphql_1.Query)(() => [String]),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ConfiguirationResolver.prototype, "checkConfiguiration", null);
ConfiguirationResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], ConfiguirationResolver);
exports.default = ConfiguirationResolver;
