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
const FilterType_1 = __importDefault(require("./FilterType"));
const AdminCollection_1 = __importDefault(require("../../../graphql/admin/resolvers/schemas/AdminCollection"));
const Theme_1 = __importDefault(require("../../theme/schemas/Theme"));
const Banner_1 = __importDefault(require("../../theme/schemas/Banner"));
let SingleWidgetCollecType = class SingleWidgetCollecType {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "displayName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "icon", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Banner_1.default, { nullable: true }),
    __metadata("design:type", Banner_1.default)
], SingleWidgetCollecType.prototype, "bannerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => AdminCollection_1.default, { nullable: true }),
    __metadata("design:type", AdminCollection_1.default)
], SingleWidgetCollecType.prototype, "collectionData", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "publishDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "expiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "publishedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], SingleWidgetCollecType.prototype, "showTabMenu", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], SingleWidgetCollecType.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Theme_1.default, { nullable: true }),
    __metadata("design:type", Theme_1.default)
], SingleWidgetCollecType.prototype, "theme", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => FilterType_1.default, { nullable: true }),
    __metadata("design:type", FilterType_1.default)
], SingleWidgetCollecType.prototype, "filter", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], SingleWidgetCollecType.prototype, "isPublished", void 0);
SingleWidgetCollecType = __decorate([
    (0, type_graphql_1.ObjectType)()
], SingleWidgetCollecType);
exports.default = SingleWidgetCollecType;
