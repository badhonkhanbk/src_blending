"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const ChallengePostSchema = new mongoose_1.Schema({
    memberId: {
        type: mongoose_1.SchemaTypes.ObjectId,
        ref: 'User',
        required: [true, 'Member ID is required'],
    },
    assignDate: { type: Date, required: true },
    images: [
        {
            url: String,
            hash: String,
        },
    ],
    myImages: [
        {
            url: String,
            hash: String,
        },
    ],
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
            consumedSize: {
                type: Number,
                default: 0,
            },
            images: [
                {
                    url: String,
                    hash: String,
                },
            ],
            myImages: [
                {
                    url: String,
                    hash: String,
                },
            ],
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
                    originalIngredientName: { type: String, default: '' },
                    quantityString: { type: String, default: '' },
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
ChallengePostSchema.index({ memberId: 1, assignDate: 1 }, { unique: true });
const ChallengePost = (0, mongoose_1.model)('challengePost', ChallengePostSchema);
exports.default = ChallengePost;
