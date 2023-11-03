"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const healthSchema = new mongoose_1.Schema({
    healthTopic: {
        type: String,
        required: [true, 'health topic is required'],
    },
    category: String,
    aliases: [String],
    source: String,
    foods: [
        {
            foodId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendIngredient',
            },
            score: Number,
        },
    ],
    nutrients: [
        {
            nutrientId: {
                type: mongoose_1.Schema.Types.ObjectId,
                ref: 'BlendNutrient',
            },
            score: Number,
        },
    ],
    status: String,
    class: String,
    description: String,
    featuredImage: String,
    images: [String],
    imageCount: Number,
    nutrientCount: Number,
    foodCount: Number,
    collections: [
        {
            type: mongoose_1.Schema.Types.ObjectId,
            ref: 'AdminCollection',
        },
    ],
    isPublished: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
healthSchema.pre('save', async function (next) {
    //@ts-ignore
    this.nutrientCount = this.nutrients.length;
    //@ts-ignore
    this.foodCount = this.foods.length;
    //@ts-ignore
    this.imageCount = this.images.length;
    next();
});
// blendIngredientSchema.pre('find', async function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
const health = (0, mongoose_1.model)('Health', healthSchema);
// blendIngredientSchema.pre('save', async function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
// blendIngredientSchema.pre('find', function (next) {
//   //@ts-ignore
//   this.nutrientCount = this.blendNutrients.length;
//   next();
// });
exports.default = health;
