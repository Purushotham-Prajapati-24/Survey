// In server/models/Survey.js
const mongoose = require('mongoose');

// Sub-schema for individual family members
const FamilyMemberSchema = new mongoose.Schema({
    name: String,
    age: Number,
    gender: String,
    relationship: String,
    education: String,
    occupation: String,
    income: Number,
});

const surveySchema = new mongoose.Schema({
    // Step 1: Household Identification
    thandaName: { type: String, required: true },
    houseNo: { type: String, required: true },
    surveyDate: { type: Date, required: true },
    respondentName: { type: String, required: true },
    gender: { type: String, required: true },
    age: { type: Number, required: true },
    mobile: { type: String, required: true },
    aadhaar: { type: String, required: true },

    // Step 2: Demographic Profile
    familyMembers: [FamilyMemberSchema], // Array of family members

    // Step 3: Livelihood
    livelihoodSources: [String],
    agriLand: String,
    agriCrops: String,
    livestockType: [String],
    livestockOther: String,

    // Step 4: Housing
    houseType: { type: String, required: true },
    ownership: { type: String, required: true },
    electricity: { type: String, required: true },
    waterSource: { type: String, required: true },
    toilet: { type: String, required: true },
    fuel: { type: String, required: true },
    assets: [String],

    // Step 5: Services
    healthFacility: { type: String, required: true },
    schoolAccess: { type: String, required: true },
    rationCard: { type: String, required: true },
    schemes: [String],

    // Step 6: Challenges
    challenges: [String],
    challengesOther: String,
    skillsDesired: String,
    techInterest: { type: String, required: true },
    techInterestDetails: String,

    // Step 7: Community
    improvements: String,
    decisionMaking: { type: String, required: true },
    trainingWillingness: { type: String, required: true },
    banjaraArt: { type: String, required: true },
    entrepreneurship: { type: String, required: true },
}, {
    // Automatically add 'createdAt' and 'updatedAt' timestamps
    timestamps: true 
});

module.exports = mongoose.model('Survey', surveySchema);