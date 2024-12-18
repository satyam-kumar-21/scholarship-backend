const mongoose = require('mongoose');

// Define the schema for the Scholar model
const scholarSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to User Model
    fatherName: { type: String, required: true },
    village: { type: String, required: false },
    city: { type: String, required: false },
    district: { type: String, required: false },
    state: { type: String, required: false },
    tenthPercentage: { type: String, required: true },
    tenthBoard: { type: String, required: true },
    twelfthPercentage: { type: String, required: false },
    twelfthBoard: { type: String, required: false },
    twelfthStream: { type: String, required: false },
    twelfthSubjects: { type: [String], required: false },  // Updated to array of strings
    ugPercentage: { type: String, required: false },
    ugUniversity: { type: String, required: false },
    ugCourse: { type: String, required: false },
    pgPercentage: { type: String, required: false },
    pgUniversity: { type: String, required: false },
    pgCourse: { type: String, required: false },
    selectedCourse: { type: String, required: true },
    selectedBranch: { type: String, required: true },
  },
  { timestamps: true }
);

// Create the Scholar model using the schema
const Scholar = mongoose.model('Scholar', scholarSchema);

module.exports = Scholar;
