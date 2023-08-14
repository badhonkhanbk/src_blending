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
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const PlanRating_1 = __importDefault(require("../../../models/PlanRating"));
const Plan_1 = __importDefault(require("../../../models/Plan"));
const AppError_1 = __importDefault(require("../../../utils/AppError"));
const CreatePlanRating_1 = __importDefault(require("./input-type/PlanRating/CreatePlanRating"));
const ReturnRatingInfo_1 = __importDefault(require("../../member/schemas/ReturnRatingInfo"));
let PlanRatingResolver = class PlanRatingResolver {
    /**
     * Update the rating of a plan.
     *
     * @param {CreateNewPlanRating} data - The data for updating the plan rating.
     * @return {Object} - An object containing the updated rating information.
     */
    async updatePlanRating(data) {
        let user = await memberModel_1.default.findOne({ _id: data.memberId });
        if (!user) {
            return new AppError_1.default('User not found', 404);
        }
        let plan = await Plan_1.default.findOne({ _id: data.planId }).select('numberOfRating averageRating totalRating');
        if (!plan) {
            return new AppError_1.default('Plan not found', 404);
        }
        let prevRating = 0;
        let ratingCount = 0;
        let totalRating = 0;
        let myPlanRating = await PlanRating_1.default.findOne({
            memberId: user._id,
            planId: plan._id,
        });
        if (!myPlanRating) {
            ratingCount = 1;
            totalRating = plan.totalRating + data.rating;
            myPlanRating = await PlanRating_1.default.create(data);
        }
        else {
            prevRating = myPlanRating.rating;
            totalRating = plan.totalRating - prevRating + data.rating;
            myPlanRating.rating = data.rating;
            myPlanRating.save();
        }
        let averageRating = totalRating / (plan.numberOfRating + ratingCount);
        await Plan_1.default.findOneAndUpdate({
            _id: plan._id,
        }, {
            numberOfRating: plan.numberOfRating + ratingCount,
            averageRating: averageRating,
            totalRating: totalRating,
        });
        return {
            numberOfRating: plan.numberOfRating + ratingCount,
            averageRating,
            myRating: data.rating,
        };
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => ReturnRatingInfo_1.default)
    /**
     * Update the rating of a plan.
     *
     * @param {CreateNewPlanRating} data - The data for updating the plan rating.
     * @return {Object} - An object containing the updated rating information.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('data', { validate: true })),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreatePlanRating_1.default]),
    __metadata("design:returntype", Promise)
], PlanRatingResolver.prototype, "updatePlanRating", null);
PlanRatingResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], PlanRatingResolver);
exports.default = PlanRatingResolver;
