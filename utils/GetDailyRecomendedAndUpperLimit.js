"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const memberModel_1 = __importDefault(require("../models/memberModel"));
const memberConfiguiration_1 = __importDefault(require("../models/memberConfiguiration"));
const Daily_1 = __importDefault(require("../models/Daily"));
async function getDailyRecomendedAndUpperLimit(userId, nutrientId) {
    let user = await memberModel_1.default.findOne({ _id: userId }).select('configuration');
    let userConfiguration = await memberConfiguiration_1.default.findOne({
        _id: user.configuration,
    }).select('age gender');
    let dailyNutrient = await Daily_1.default.findOne({
        blendNutrientRef: nutrientId,
    });
    if (!dailyNutrient) {
        return {
            dailyRecomended: 0,
            upperLimit: 0,
        };
    }
    let gender = '';
    if (userConfiguration.gender === 'Male') {
        gender = 'males';
    }
    else if (userConfiguration.gender === 'Female') {
        gender = 'females';
    }
    else {
    }
    let ranges = dailyNutrient.ranges.filter((range) => {
        return range.lifeStageGroup === gender;
    });
    let returnData = {};
    for (let i = 0; i < ranges.length; i++) {
        if (ranges[i].ageRangeFrom) {
            if (userConfiguration.age.quantity >= ranges[i].ageRangeFrom &&
                userConfiguration.age.quantity <= ranges[i].ageRangeTo) {
                returnData.dailyRecomended = ranges[i].value ? ranges[i].value : 0;
                returnData.upperLimit = ranges[i].upperLimit ? ranges[i].upperLimit : 0;
                break;
            }
        }
    }
    if (!returnData.dailyRecomended) {
        returnData.dailyRecomended = 0;
        returnData.upperLimit = 0;
    }
    else {
        return returnData;
    }
}
exports.default = getDailyRecomendedAndUpperLimit;
