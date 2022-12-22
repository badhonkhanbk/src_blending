"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
let roleType = {
    delete: {
        type: Boolean,
        default: false,
    },
    create: {
        type: Boolean,
        default: false,
    },
    edit: {
        type: Boolean,
        default: false,
    },
    view: {
        type: Boolean,
        default: false,
    },
};
const roleSchema = new mongoose_1.Schema({
    roleName: {
        type: String,
        required: [true, 'roleName is required'],
        unique: true,
    },
    Users: roleType,
    Shop: roleType,
    Dashboard: roleType,
    Blend: roleType,
    Admin: roleType,
    All: roleType,
    Wiki: roleType,
    createdAt: { type: Date, default: Date.now },
});
const role = (0, mongoose_1.model)('Role', roleSchema);
exports.default = role;
