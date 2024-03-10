var express = require('express');
var router = express.Router();

// import course controller
const courseController = require('../controllers/course.controller');

// Create Course            POST
router.post('/', courseController.createCourse);

// Get All Courses          GET
router.get('/', courseController.getAll);

// Get Instructor Courses   GET
router.get('/byinstructor/:instructorID', courseController.getInstrCourses);

// Enroll Course            PUT
router.put('/enroll/:courseID', courseController.enroll);

// Get Student Courses      GET
router.get('/bystudent/:studentID', courseController.getStudentCourses);

// Get Course Grades        GET
router.get('/coursegrades/:courseID/:studentID', courseController.getCourseGrades);


module.exports = router;