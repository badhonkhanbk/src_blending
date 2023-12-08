"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spaceInviteSchema = new mongoose_1.Schema({
    inviteTo: [
        {
            user: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: {
                type: Boolean,
                default: false,
            },
        },
    ],
    message: {
        type: String,
        default: '',
    },
    spaceRoomId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'SpaceRoom',
    },
    createdBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
    },
    notFoundEmails: [String],
}, {
    timestamps: true,
});
const SpaceInvite = (0, mongoose_1.model)('SpaceInvite', spaceInviteSchema);
exports.default = SpaceInvite;
