const courseService = require('../services/course.service');

// Create Course
exports.createCourse = (req, res) => {
    console.log("\nCREATE COURSE");

    courseService.createCourse(req.body, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log("Course Exists");
            res.status(404).send(result);
        }
    })
}

// Get All Courses
exports.getAll = (req, res) => {
    console.log("\nGET ALL COURSES");

    courseService.getAll((err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}

// Get Instructor Courses
exports.getInstrCourses = (req, res) => {
    console.log("\nGET INSTRUCTOR COURSES FOR: ", req.params.instructorID);

    courseService.getInstrCourses(req.params.instructorID, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result)
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}

// Student Enroll
exports.enroll = (req,res) => {
    console.log("\nSTUDENT: ", req.body.student, " ENROLLING INTO COURSE: ", req.params.courseID);

    courseService.enroll(req.params.courseID, req.body.student, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result);
        }
        if(result.status == true){
            console.log(result);
            res.status(200).send(result);
        }
        else{
            console.log(result);
            res.status(404).send(result);
        }
    })
}

// Get Student Courses
exports.getStudentCourses = (req, res) => {
    console.log("\nGET STUDENT COURSES FOR: ", req.params.studentID);

    courseService.getStudentCourses(req.params.studentID, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result)
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}

// Get Student Course Grades
exports.getCourseGrades = (req, res) => {
    console.log("\nGET COURSE GRADES");

    courseService.getCourseGrades(req.params.courseID, req.params.studentID, (err, result) => {
        if(err){
            console.log(err);
            res.status(400).send(result)
        }
        else{
            console.log(result);
            res.status(200).send(result);
        }
    })
}