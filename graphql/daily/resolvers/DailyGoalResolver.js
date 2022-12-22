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
        //@ts-ignore
        let macros = data.goals.filter((goal) => goal.showPercentage);
        await memberModel_1.default.findOneAndUpdate({ _id: data.memberId }, {
            macroInfo: macros,
        });
        await DailyGoal_1.default.findOneAndUpdate({ memberId: data.memberId }, { goals: data.goals, calories: data.calories, bmi: data.bmi });
        return 'success';
    }
    async getDailyGoals(memberId) {
        let dailyGoal = await DailyGoal_1.default.findOne({ memberId });
        let returnDailyGoal = {};
        //@ts-ignore
        let data = dailyGoal.goals.reduce((acc, cur) => {
            if (!acc[cur.blendNutrientId]) {
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
    (0, type_graphql_1.Mutation)(() => String) // client
    ,
    __param(0, (0, type_graphql_1.Arg)('data')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [CreateEditDailyGoal_1.default]),
    __metadata("design:returntype", Promise)
], DailyGoalResolver.prototype, "updateDailyGoals", null);
__decorate([
    (0, type_graphql_1.Query)(() => ReturnDailyGoal_1.default),
    __param(0, (0, type_graphql_1.Arg)('memberId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], DailyGoalResolver.prototype, "getDailyGoals", null);
DailyGoalResolver = __decorate([
    (0, type_graphql_1.Resolver)()
], DailyGoalResolver);
exports.default = DailyGoalResolver;
