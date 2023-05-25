"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    slug: String,
    image: String,
    description: String,
    userId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
    },
    recipes: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            unique: true,
            ref: 'Recipe',
        },
    ],
    visible: { type: Boolean, default: true },
    updatedAt: { type: Date, default: Date.now },
    shareTo: [
        {
            userId: {
                type: mongoose_1.SchemaTypes.ObjectId,
                ref: 'User',
            },
            hasAccepted: {
                type: Boolean,
                default: false,
            },
            personalizedName: {
                type: String,
                default: '',
            },
            canContribute: {
                type: Boolean,
                default: false,
            },
            canShareWithOther: {
                type: Boolean,
                default: false,
            },
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
});
const UserCollection = (0, mongoose_1.model)('UserCollection', userCollectionSchema);
exports.default = UserCollection;
