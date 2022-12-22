"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const DailyGoalSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        unique: true,
        required: [true, 'Member ID is required'],
    },
    goals: [
        {
            blendNutrientId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'BlendNutrient',
            },
            goal: Number,
            dri: Number,
            percentage: Number,
        },
    ],
    calories: {
        goal: Number,
        dri: Number,
    },
    bmi: Number,
});
const DailyGoal = (0, mongoose_1.model)('dailyGoal', DailyGoalSchema);
exports.default = DailyGoal;
