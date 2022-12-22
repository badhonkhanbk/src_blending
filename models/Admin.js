"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminSchema = new mongoose_1.Schema({
    firstName: String,
    lastName: String,
    displayName: String,
    location: String,
    email: { type: String, required: [true, 'email is required'], unique: true },
    number: String,
    title: String,
    notes: String,
    profilePicture: String,
    createdAt: { type: Date, default: Date.now },
    role: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: 'Role',
    },
});
const Admin = (0, mongoose_1.model)('Admin', adminSchema);
exports.default = Admin;
