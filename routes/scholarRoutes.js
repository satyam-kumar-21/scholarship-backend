const express = require('express');
const scholarController = require('../controllers/scholarController');

const router = express.Router();

// Route for creating a scholarship application
router.post('/submit-scholarship', scholarController.createScholarship);

// Route for getting scholarship by userId
router.get('/scholarship/:userId', scholarController.getScholarshipByUserId);

// Route for getting all scholarship applications (admin)
router.get('/all-scholarships', scholarController.getAllScholarships);

// Route for updating scholarship application
router.put('/update-scholarship/:userId', scholarController.updateScholarship);

// Route for deleting a scholarship application
router.delete('/delete-scholarship/:userId', scholarController.deleteScholarship);

module.exports = router;
