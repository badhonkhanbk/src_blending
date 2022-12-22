"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shareChallengeGlobalSchema = new mongoose_1.Schema({
    challengeId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Challenge',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const shareChallengeGlobal = (0, mongoose_1.model)('SharehallengeGlobal', shareChallengeGlobalSchema);
exports.default = shareChallengeGlobal;
