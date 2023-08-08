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
const CreateEditDailyGoal_1 = __importDefault(require("./input-type/DailyGoal/CreateEditDailyGoal"));
const DailyGoal_1 = __importDefault(require("../../../models/DailyGoal"));
const memberModel_1 = __importDefault(require("../../../models/memberModel"));
const ReturnDailyGoal_1 = __importDefault(require("../schemas/ReturnDailyGoal"));
let DailyGoalResolver = class DailyGoalResolver {
    async updateDailyGoals(data) {
        //@ts-ignore - Ignore the TypeScript error for now
        let macros = data.goals.filter((goal) => goal.showPercentage); // Filter the goals array to only include goals that have the showPercentage property
        // Update the MemberModel document that matches the memberId with the macroInfo field set to the filtered macros
        await memberModel_1.default.findOneAndUpdate({ _id: data.memberId }, {
            macroInfo: macros,
        });
        // Update the DailyGoalModel document that matches the memberId with the goals, calories, and bmi fields set to the corresponding values from the data parameter
        await DailyGoal_1.default.findOneAndUpdate({ memberId: data.memberId }, { goals: data.goals, calories: data.calories, bmi: data.bmi });
        return 'success'; // Return 'success' as the result of the mutation
    }
    /**
     * Retrieves the daily goals for a given member.
     *
     * @param {String} memberId - The ID of the member.
     * @return {Object} The daily goals for the member.
     */
    async getDailyGoals(memberId) {
        let dailyGoal = await DailyGoal_1.default.findOne({ memberId });
        let returnDailyGoal = {};
        //@ts-ignore
        let data = dailyGoal.goals.reduce((acc, cur) => {
            //@ts-ignore
            if (!acc[cur.blendNutrientId]) {
                //@ts-ignore
                acc[cur.blendNutrientId] = {
                    blendNutrientId: cur.blendNutrientId,
                    goal: cur.goal,
                    dri: cur.dri,
                    percentage: cur.percentage,
                    showPercentage: cur.percentage ? true : false,
                };
            }
            return acc;
        }, {});
        returnDailyGoal.calories = dailyGoal.calories;
        returnDailyGoal.bmi = dailyGoal.bmi;
        returnDailyGoal.goals = JSON.stringify(data);
        returnDailyGoal.memberId = dailyGoal.memberId;
        return returnDailyGoal;
    }
};
__decorate([
    (0, type_graphql_1.Mutation)(() => String) // Declare that this function is a GraphQL mutation and will return a string
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditDailyGoal_1.default]),
    __metadata("design:returntype", Promise)
], DailyGoalResolver.prototype, "updateDailyGoals", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReturnDailyGoal_1.default)
    /**
     * Retrieves the daily goals for a given member.
     *
     * @param {String} memberId - The ID of the member.
     * @return {Object} The daily goals for the member.
     */
    ,
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyGoalResolver.prototype, "getDailyGoals", null);
DailyGoalResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], DailyGoalResolver);
exports.default = DailyGoalResolver;
