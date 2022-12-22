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
const RelatedSource_1 = __importDefault(require("./RelatedSource"));
let Nutrient = class Nutrient {
};
__decorate([
    (0, type_graphql_1.Field)(() => type_graphql_1.ID),
    __metadata("design:type", String)
], Nutrient.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "nutrient", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "category", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "value", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "id", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "unitName", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "parentNutrient", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "min", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Number)
], Nutrient.prototype, "rank", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Nutrient.prototype, "publication_date", void 0);
__decorate([
    (0, type_graphql_1.Field)(() => [RelatedSource_1.default], { nullable: true }),
    __metadata("design:type", Array)
], Nutrient.prototype, "related_sources", void 0);
Nutrient = __decorate([
    (0, type_graphql_1.ObjectType)()
], Nutrient);
exports.default = Nutrient;
// image: String,
// bio: String,
// provider: {
//   type: String,
//   enum: ['email', 'google', 'facebook'],
//   default: 'email',
// },
// cognitoUsername: {
//   type: String,
//   required: true,
// },
// socialAccounts: [
//   {
//     name: String,
//     link: String,
//   },
// ],
// firstName: String,
// lastName: String,
// displayName: String,
// gender: String,
// email: String,
// mobileNumber: String,
// address: {
//   streetAddress: String,
//   apartmentNo: String,
//   city: String,
//   state: String,
// },
// orderHistoty: [String],
// myCart: [String],
// recentViewedProducts: [String],
// resetTokenTimeToExpire: Date,
// myResetToken: String,
// createdAt: { type: Date, default: Date.now },
