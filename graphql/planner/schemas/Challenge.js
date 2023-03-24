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
const ChallengePost_1 = __importDefault(require("./ChallengePost"));
const ImageWithHash_1 = __importDefault(require("./ImageWithHash"));
let Challenge = class Challenge {
};
__decorate([
    (0, type_graphql_1.Field)((type) => type_graphql_1.ID, { nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "_id", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => Date),
    __metadata("design:type", String)
], Challenge.prototype, "assignDate", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "date", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "dayName", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ImageWithHash_1.default], { nullable: true }),
    __metadata("design:type", Array)
], Challenge.prototype, "images", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], Challenge.prototype, "disabled", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [ChallengePost_1.default]),
    __metadata("design:type", Array)
], Challenge.prototype, "posts", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", String)
], Challenge.prototype, "formattedDate", void 0);
Challenge = __decorate([
    (0, type_graphql_1.ObjectType)()
], Challenge);
exports.default = Challenge;
