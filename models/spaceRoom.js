"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const spaceRoomSchema = new mongoose_1.Schema({
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
    createdBy: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
    },
    isActive: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
const SpaceRoom = (0, mongoose_1.model)('SpaceRoom', spaceRoomSchema);
exports.default = SpaceRoom;
