"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const PlanShareSchema = new mongoose_1.Schema({
    invitedBy: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'User' },
    planId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'Plan' },
});
const PlanShare = (0, mongoose_1.model)('PlanShare', PlanShareSchema);
exports.default = PlanShare;
