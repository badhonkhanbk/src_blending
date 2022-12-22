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
const type_graphql_2 = require("type-graphql");
var MatrixName;
(function (MatrixName) {
    MatrixName["gi"] = "totalGi";
    MatrixName["gl"] = "totalGl";
    MatrixName["calorie"] = "calorie";
    MatrixName["netCarbs"] = "netCarbs";
})(MatrixName || (MatrixName = {}));
(0, type_graphql_2.registerEnumType)(MatrixName, {
    name: 'MatrixName',
    description: 'The basic directions', // this one is optional
});
let NutrientMatrix = class NutrientMatrix {
};
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], NutrientMatrix.prototype, "lessThan", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], NutrientMatrix.prototype, "greaterThan", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Boolean)
], NutrientMatrix.prototype, "beetween", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], NutrientMatrix.prototype, "value1", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], NutrientMatrix.prototype, "value2", void 0);
__decorate([
    (0, type_graphql_1.Field)(),
    __metadata("design:type", Number)
], NutrientMatrix.prototype, "value", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => MatrixName),
    __metadata("design:type", String)
], NutrientMatrix.prototype, "matrixName", void 0);
NutrientMatrix = __decorate([
    (0, type_graphql_1.InputType)()
], NutrientMatrix);
exports.default = NutrientMatrix;
