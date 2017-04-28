"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("Express");
const databaseconnection_1 = require("../utilities/databaseconnection");
const helpingFunctions_1 = require("../utilities/helpingFunctions");
var config = require("../../config.json");
const restrictions_1 = require("../utilities/restrictions");
var jwt = require('jsonwebtoken');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' }), fileSystem = require('fs'), path = require('path');
class Course {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }
    getRouter() {
        return this.router;
    }
    setRoutes() {
        this.getRouter().get("/", this.getCourses);
        this.getRouter().post("/", this.addCourse);
        this.getRouter().put("/:courseId", this.addStudentToCourse);
        this.getRouter().post("/:courseId/attachment", upload.single('picture'), this.addAttachment);
        this.getRouter().get("/:courseId/attachment/:filename", this.getAttachments);
    }
    getAttachments(req, res) {
        var teacherId = req['decoded']._doc._id;
        var id = req.params.courseId;
        var filename = req.params.filename;
        var model = databaseconnection_1.DatabaseConnection.getModels();
        model.course.findById(id).exec().then(course => {
            var run = false;
            var fileObject;
            course.attachments.forEach(element => {
                if (element.filename == filename) {
                    run = true;
                    fileObject = element;
                }
            });
            if (run) {
                var filePath = path.join(__dirname, "../../uploads/" + fileObject.filename);
                res.setHeader('Content-type', fileObject.mimetype);
                res.download(filePath);
            }
            else {
                res.send(helpingFunctions_1.HelpingFunctions.failureResponse("File Not found"));
            }
        }, helpingFunctions_1.HelpingFunctions.handleError(res));
    }
    addAttachment(req, res) {
        var teacherId = req['decoded']._doc._id;
        var id = req.params.courseId;
        console.log("here");
        var model = databaseconnection_1.DatabaseConnection.getModels();
        model.course.findById(id).exec().then(course => {
            if (course != null) {
                console.log(req['file']);
                course.attachments.push(req['file']);
                course.save().then(newCourse => {
                    res.send(helpingFunctions_1.HelpingFunctions.successResponse("Attachment added!", newCourse));
                }, helpingFunctions_1.HelpingFunctions.handleError(res));
            }
            else {
                res.send(helpingFunctions_1.HelpingFunctions.failureResponse("Course Not Found"));
            }
        }, helpingFunctions_1.HelpingFunctions.handleError(res));
    }
    getCourses(req, res) {
        var usertype = req['decoded']._doc.type;
        var model = databaseconnection_1.DatabaseConnection.getModels();
        var JSON = {};
        if (usertype == restrictions_1.USER_TYPE.TEACHER) {
            JSON['teacher'] = req['decoded']._doc._id;
        }
        else if (usertype == restrictions_1.USER_TYPE.STUDENT) {
            JSON['students'] = req['decoded']._doc._id;
        }
        model.course.find(JSON).exec().then(courses => {
            res.send(helpingFunctions_1.HelpingFunctions.successResponse("Courses", courses));
        }, helpingFunctions_1.HelpingFunctions.handleError(res));
    }
    addCourse(req, res) {
        var model = databaseconnection_1.DatabaseConnection.getModels();
        var courseName = req.body.name;
        var course = new model.course({
            name: courseName,
            teacher: req['decoded']._doc._id,
            students: []
        });
        course.save().then(newCourse => {
            res.send(helpingFunctions_1.HelpingFunctions.successResponse("Course Added", newCourse));
        }, helpingFunctions_1.HelpingFunctions.handleError(res));
    }
    addStudentToCourse(req, res) {
        var id = req.params.courseId;
        var model = databaseconnection_1.DatabaseConnection.getModels();
        model.course.findById(id).exec().then(course => {
            if (course != null) {
                course.students.push(req['decoded']._doc._id);
                course.save().then(output => {
                    res.send(helpingFunctions_1.HelpingFunctions.successResponse("Assigned to the course!", output));
                }, helpingFunctions_1.HelpingFunctions.handleError(res));
            }
            else {
                res.send(helpingFunctions_1.HelpingFunctions.failureResponse("Error! Course not found"));
            }
        }, helpingFunctions_1.HelpingFunctions.handleError(res));
    }
}
exports.Course = Course;
