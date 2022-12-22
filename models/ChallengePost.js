"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChallengePostSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'Member',
        required: [true, 'Member ID is required'],
    },
    assignDate: { type: Date, required: true },
    images: [String],
    date: String,
    posts: [
        {
            //recipeId: { type: SchemaTypes.ObjectId, ref: 'Recipe' },
            servings: {
                type: Number,
                default: 1,
            },
            servingSize: {
                type: Number,
                default: 0,
            },
            images: [String],
            recipeImage: String,
            recipeBlendCategory: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'RecipeCategory',
            },
            name: String,
            note: String,
            createdAt: { type: Date, default: Date.now() },
            ingredients: [
                {
                    ingredientId: { type: mongoose_1.Schema.Types.ObjectId, ref: 'BlendIngredient' },
                    selectedPortion: { name: String, quantity: Number, gram: Number },
                    weightInGram: Number,
                    portions: [
                        { name: String, quantiy: Number, default: Boolean, gram: Number },
                    ],
                },
            ],
        },
    ],
});
const ChallengePost = (0, mongoose_1.model)('challengePost', ChallengePostSchema);
exports.default = ChallengePost;
