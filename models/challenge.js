"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const FormateDate_1 = __importDefault(require("../utils/FormateDate"));
const ChallengeSchema = new mongoose_1.Schema({
    challengeName: {
        type: 'string',
        required: [true, 'challengeName is required'],
    },
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'Member ID is required'],
    },
    description: {
        type: 'string',
        default: '',
    },
    notification: {
        type: 'boolean',
        default: false,
    },
    startDate: { type: Date, required: [true, 'Start date is required'] },
    startDateString: String,
    endDate: { type: Date, required: [true, 'End date is required'] },
    endDateString: String,
    startingDate: String,
    days: Number,
    isActive: {
        type: Boolean,
        default: false,
    },
    sharedWith: [
        {
            memberId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User' },
            canInviteWithOthers: { type: Boolean, default: false },
            isDefault: { type: Boolean, default: false },
            blendScore: Number,
        },
    ],
    topIngredients: [
        {
            ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
            count: Number,
        },
    ],
});
ChallengeSchema.pre('save', async function (next) {
    //@ts-ignore
    this.startingDate =
        this.startDate.toLocaleString('default', {
            month: 'short',
        }) +
            ' ' +
            this.startDate.getDate() +
            ', ' +
            this.startDate.getFullYear();
    this.startDateString = (0, FormateDate_1.default)(this.startDate);
    this.endDateString = (0, FormateDate_1.default)(this.endDate);
    next();
});
const Challenge = (0, mongoose_1.model)('challenge', ChallengeSchema);
exports.default = Challenge;
