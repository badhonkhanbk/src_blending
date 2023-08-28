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
const AddFilter_1 = __importDefault(require("./AddFilter"));
var OrderBy;
(function (OrderBy) {
    OrderBy["PUBLISHED_DATE"] = "PUBLISHED_DATE";
    OrderBy["POPULARITY"] = "POPULARITY";
    OrderBy["ALPHABETICALLY"] = "ALPHABETICALLY";
})(OrderBy || (OrderBy = {}));
(0, type_graphql_1.registerEnumType)(OrderBy, {
    name: 'category',
    description: 'The basic directions', // this one is optional
});
let WidgetCollection = class WidgetCollection {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WidgetCollection.prototype, "displayName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "icon", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "banner", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "bannerId", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WidgetCollection.prototype, "slug", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], WidgetCollection.prototype, "collectionData", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "publishDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "expiryDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WidgetCollection.prototype, "showTabMenu", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "publishedBy", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], WidgetCollection.prototype, "orderBy", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], WidgetCollection.prototype, "theme", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => AddFilter_1.default, { nullable: true }),
    __metadata("design:type", AddFilter_1.default)
], WidgetCollection.prototype, "filter", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], WidgetCollection.prototype, "isPublished", void 0);
WidgetCollection = __decorate([
    (0, type_graphql_1.InputType)()
], WidgetCollection);
exports.default = WidgetCollection;
