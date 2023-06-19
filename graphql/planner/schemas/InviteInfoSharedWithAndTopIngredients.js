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
const SharedWith_1 = __importDefault(require("./SharedWith"));
const TopIngredient_1 = __importDefault(require("./TopIngredient"));
const inviteInfo_1 = __importDefault(require("./inviteInfo"));
let InviteInfoSharedWithAndTopIngredients = class InviteInfoSharedWithAndTopIngredients {
};
__decorate([
    (0, type_graphql_1.Field)((type) => inviteInfo_1.default),
    __metadata("design:type", inviteInfo_1.default)
], InviteInfoSharedWithAndTopIngredients.prototype, "invite", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [SharedWith_1.default], { nullable: true }),
    __metadata("design:type", Array)
], InviteInfoSharedWithAndTopIngredients.prototype, "sharedWith", void 0);
__decorate([
    (0, type_graphql_1.Field)((type) => [TopIngredient_1.default], { nullable: true }),
    __metadata("design:type", Array)
], InviteInfoSharedWithAndTopIngredients.prototype, "topIngredients", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], InviteInfoSharedWithAndTopIngredients.prototype, "hasAccepted", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], InviteInfoSharedWithAndTopIngredients.prototype, "hasInvited", void 0);
__decorate([
    (0, type_graphql_1.Field)({ nullable: true }),
    __metadata("design:type", Boolean)
], InviteInfoSharedWithAndTopIngredients.prototype, "isOwner", void 0);
InviteInfoSharedWithAndTopIngredients = __decorate([
    (0, type_graphql_1.ObjectType)()
], InviteInfoSharedWithAndTopIngredients);
exports.default = InviteInfoSharedWithAndTopIngredients;
