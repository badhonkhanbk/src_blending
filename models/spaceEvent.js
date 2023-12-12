"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spaceEventSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    description: {
        type: String,
        default: '',
    },
    spaceId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Space',
    },
    slug: String,
    createdAtStringType: String,
    createdAtDateType: Date,
    duration: {
        type: Number,
        default: 0,
    },
    tickets: [
        {
            name: String,
            price: Number,
            quantity: Number,
            /** ID of the rooms checked from the tree */
            rooms: [
                {
                    type: mongoose_1.SchemaTypes.ObjectId,
                    ref: 'SpaceRoom',
                },
            ],
            /** ID of the meetups checked from the tree */
            meetups: [String],
        },
    ],
    createdBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
    },
}, {
    timestamps: true,
});
const SpaceEvent = (0, mongoose_1.model)('SpaceEvent', spaceEventSchema);
exports.default = SpaceEvent;
