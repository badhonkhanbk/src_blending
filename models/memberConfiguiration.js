"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const memberConfiguirationSchema = new mongoose_1.Schema({
    gender: {
        type: String,
        enum: ['male', 'female', 'others'],
    },
    weightInKilograms: Number,
    age: {
        quantity: Number,
        years: Boolean,
        months: Boolean,
    },
    heightInCentimeters: Number,
    activity: {
        type: String,
        enum: ['low', 'moderate', 'high'],
    },
    dieteryLifeStyle: String,
    pregnantOrLactating: String,
    allergies: [String],
    preExistingMedicalConditions: [String],
    meditcation: [String],
    whyBlending: [String],
});
const MemberConfiguiration = (0, mongoose_1.model)('MemberConfiguiration', memberConfiguirationSchema);
exports.default = MemberConfiguiration;
// gender: String (enum)
// weight: String
// age: Number
// height: String
// activity: String (enum)
// dietaryLifestyle: String (enum)
// allergies: String
// preExistingMedicalConditions: [String]
// meditcation: [String]
// whyBlending: [String]
