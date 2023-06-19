"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const inviteChallengeSchema = new mongoose_1.Schema({
    invitedBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'MemberId is required'],
    },
    invitedWith: [
        {
            memberId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: { type: Boolean, default: false },
            canInviteWithOthers: { type: Boolean, default: false },
        },
    ],
    challengeId: { type: mongoose_1.SchemaTypes.ObjectId, ref: 'challenge' },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const inviteChallenge = (0, mongoose_1.model)('inviteChallenge', inviteChallengeSchema);
exports.default = inviteChallenge;
