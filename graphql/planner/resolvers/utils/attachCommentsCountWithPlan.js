"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const planComment_1 = __importDefault(require("../../../../models/planComment"));
async function attachCommentsCountWithPlan(planId) {
    let commentsCount = await planComment_1.default.countDocuments({
        planId: planId,
    });
    return commentsCount;
}
exports.default = attachCommentsCountWithPlan;
