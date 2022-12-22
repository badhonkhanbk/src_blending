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
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
var CollectionType;
(function (CollectionType) {
    CollectionType["INGREDIENT"] = "Ingredient";
    CollectionType["RECIPE"] = "Recipe";
    CollectionType["WIKI"] = "Wiki";
})(CollectionType || (CollectionType = {}));
let AdminCollection = class AdminCollection {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], AdminCollection.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminCollection.prototype, "name", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [type_graphql_1.ID]),
    __metadata("design:type", Array)
], AdminCollection.prototype, "children", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", String)
], AdminCollection.prototype, "collectionType", void 0);
AdminCollection = __decorate([
    (0, type_graphql_1.ObjectType)()
], AdminCollection);
exports.default = AdminCollection;
