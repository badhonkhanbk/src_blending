"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const adminCollectionSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, 'collection name is required'],
    },
    children: [{ type: mongoose_1.Schema.Types.ObjectId, refPath: 'collectionType' }],
    collectionType: {
        type: String,
        required: [true, 'collection type is required'],
        enum: ['Ingredient', 'Recipe', 'Wiki', 'GeneraBlog', 'Plan'],
    },
});
const AdminCollection = (0, mongoose_1.model)('AdminCollection', adminCollectionSchema);
exports.default = AdminCollection;
