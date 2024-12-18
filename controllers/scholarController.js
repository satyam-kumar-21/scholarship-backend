const express = require('express');
const Scholar = require('../models/Scholar');
const User = require('../models/User');

// Validation Middleware (using express-validator)
const { body, validationResult } = require('express-validator');

const validateScholarship = [
  body('userId').notEmpty().withMessage('User ID is required'),
  body('fatherName').notEmpty().withMessage('Father Name is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ success: false, errors: errors.array() });
    }
    next();
  }
];

// Create Scholarship
const createScholarship = async (req, res) => {
  const { userId,
    fatherName, village, city, district, state,
    tenthPercentage, tenthBoard, twelfthPercentage, twelfthBoard,
    twelfthStream, twelfthSubjects, ugPercentage, ugUniversity, ugCourse,
    selectedCourse, selectedBranch } = req.body;

  try {
    const scholarForm = new Scholar({
      userId,
      fatherName, village, city, district, state,
      tenthPercentage, tenthBoard, twelfthPercentage, twelfthBoard,
      twelfthStream, twelfthSubjects, ugPercentage, ugUniversity, ugCourse,
      selectedCourse, selectedBranch
    });
    const savedScholarForm = await scholarForm.save();

    await User.findByIdAndUpdate(userId, { scholarFormId: savedScholarForm._id });

    return res.status(201).json({ success: true, message: 'Scholarship submitted successfully!', scholarFormId: savedScholarForm._id,scholar:savedScholarForm });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error submitting scholarship application', error });
  }
};

// Get Scholarship By User ID
const getScholarshipByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const scholarForm = await Scholar.findOne({ userId }).populate('userId', 'name email mobile');
    if (!scholarForm) return res.status(404).json({ success: false, message: 'Scholarship not found for this user' });

    return res.status(200).json({ success: true, scholarForm });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error retrieving scholarship form', error });
  }
};

// Get All Scholarships (with pagination)
const getAllScholarships = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const scholarships = await Scholar.find()
      .populate('userId', 'name email mobile')
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    return res.status(200).json({ success: true, scholarships });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error retrieving all scholarships', error });
  }
};

// Update Scholarship
const updateScholarship = async (req, res) => {
  const { userId } = req.params;

  try {
    const updatedScholarForm = await Scholar.findOneAndUpdate({ userId }, req.body, { new: true });
    if (!updatedScholarForm) return res.status(404).json({ success: false, message: 'Scholarship form not found for this user' });

    return res.status(200).json({ success: true, message: 'Scholarship updated successfully', updatedScholarForm });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error updating scholarship', error });
  }
};

// Delete Scholarship
const deleteScholarship = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedScholarForm = await Scholar.findOneAndDelete({ userId });
    if (!deletedScholarForm) return res.status(404).json({ success: false, message: 'Scholarship form not found for this user' });

    await User.findByIdAndUpdate(userId, { scholarFormId: null });

    return res.status(200).json({ success: true, message: 'Scholarship deleted successfully' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: 'Error deleting scholarship', error });
  }
};

module.exports = {
  createScholarship,
  getScholarshipByUserId,
  getAllScholarships,
  updateScholarship,
  deleteScholarship,
  validateScholarship
};







