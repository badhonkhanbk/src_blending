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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const DataTypeForClient_1 = __importDefault(require("./DataTypeForClient"));
const FilterType_1 = __importDefault(require("./FilterType"));
const AdminCollection_1 = __importDefault(require("../../admin/resolvers/schemas/AdminCollection"));
const Theme_1 = __importDefault(require("../../theme/schemas/Theme"));
let WidgetCollectionForClient = class WidgetCollectionForClient {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "displayName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "icon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "banner", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WidgetCollectionForClient.prototype, "showTabMenu", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", DataTypeForClient_1.default)
], WidgetCollectionForClient.prototype, "data", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => FilterType_1.default, { nullable: true }),
    __metadata("design:type", FilterType_1.default)
], WidgetCollectionForClient.prototype, "filter", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(type => Theme_1.default, { nullable: true }),
    __metadata("design:type", Theme_1.default)
], WidgetCollectionForClient.prototype, "theme", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "bannerLink", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "publishDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollectionForClient.prototype, "expiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", AdminCollection_1.default)
], WidgetCollectionForClient.prototype, "collectionData", void 0);
WidgetCollectionForClient = __decorate([
    (0, type_graphql_1.ObjectType)()
], WidgetCollectionForClient);
exports.default = WidgetCollectionForClient;
