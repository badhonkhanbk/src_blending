"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userViewTrackSchema = new mongoose_1.Schema({
    collectionType: {
        type: String,
        required: [true, 'collection type is required'],
    },
    documentId: {
        type: mongoose_1.Schema.Types.ObjectId,
        refPath: 'onModel',
        required: true,
    },
    onModel: {
        type: String,
        required: true,
        enum: [
            'BlendIngredient',
            'BlendNutrient',
            'RecipeModel',
            'Wiki',
            'challenge',
            'GeneraBlog',
            'Space',
            'Widget',
            'Plan',
            'Planner',
        ],
    },
    userId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });
const UserViewTrack = (0, mongoose_1.model)('UserViewTrack', userViewTrackSchema);
exports.default = UserViewTrack;
