"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spaceSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    description: {
        type: String,
        default: '',
    },
    createdBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Admin',
    },
    members: [
        {
            email: {
                type: String,
                default: '',
            },
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: {
                type: Boolean,
                default: false,
            },
            invitedBy: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Admin',
            },
            message: {
                type: String,
                default: '',
            },
        },
    ],
    facilitators: [
        {
            email: {
                type: String,
                default: '',
            },
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: {
                type: Boolean,
                default: false,
            },
            invitedBy: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Admin',
            },
            message: {
                type: String,
                default: '',
            },
        },
    ],
    guests: [
        {
            email: String,
            hasAccepted: {
                type: Boolean,
                default: false,
            },
            invitedBy: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'Admin',
            },
            message: {
                type: String,
                default: '',
            },
        },
    ],
    meetupSolutions: {
        meet: {
            type: Boolean,
            default: false,
        },
        meetings: {
            type: Boolean,
            default: false,
        },
        webinars: {
            type: Boolean,
            default: false,
        },
        broadCast: {
            type: Boolean,
            default: false,
        },
    },
}, {
    timestamps: true,
});
const space = (0, mongoose_1.model)('space', spaceSchema);
exports.default = space;
