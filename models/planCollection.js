"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const planCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'name is required'],
    },
    slug: String,
    image: String,
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
    },
    plans: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'Plan',
        },
    ],
    createdAt: {
        type: Date,
        default: Date.now,
    },
    isDefault: {
        type: Boolean,
        default: false,
    },
    collectionDataCount: {
        type: Number,
        default: 0,
    },
    updatedAt: { type: Date, default: Date.now },
});
const PlanCollection = (0, mongoose_1.model)('PlanCollection', planCollectionSchema);
exports.default = PlanCollection;
