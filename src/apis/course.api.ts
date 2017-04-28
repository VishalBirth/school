import { ICourseModel } from '../models/course.model';
import * as express from 'Express';
import * as mongoose from 'mongoose';
import { DatabaseConnection } from '../utilities/databaseconnection';
import { IModel } from '../models/model';
import {Router, Request, Response} from "express";
import { HelpingFunctions } from '../utilities/helpingFunctions';
import { MailSender } from '../utilities/mailSender';
var config = require("../../config.json") //import config file
import { USER_TYPE } from '../utilities/restrictions';
var jwt    = require('jsonwebtoken');

var multer  = require('multer')
var upload = multer({ dest: 'uploads/' }), fileSystem = require('fs'), path = require('path');
export class Course{
    
    private router : express.Router
    
    constructor(){
        this.router = express.Router();  
        this.setRoutes(); 
    
    }
    public getRouter(): express.Router{
        return this.router;
    }
    private setRoutes(){
        this.getRouter().get("/", this.getCourses)
        this.getRouter().post("/", this.addCourse)
        this.getRouter().put("/:courseId", this.addStudentToCourse)
        this.getRouter().post("/:courseId/attachment", upload.single('picture'),  this.addAttachment)
        this.getRouter().get("/:courseId/attachment/:filename", this.getAttachments)
    }
    private getAttachments(req: Request, res: Response){
        var teacherId = req['decoded']._doc._id;
        var id = req.params.courseId
        var filename = req.params.filename
        var model = DatabaseConnection.getModels()
        model.course.findById(id).exec().then(course=>{
            var run = false
            var fileObject: { 
                fieldname: string,
                originalname: string,
                encoding: string,
                mimetype: string,
                destination: string,
                filename: string,
                path: string,
                size: Number 
            };
            course.attachments.forEach(element => {
                if(element.filename == filename){
                    run = true;
                    fileObject = element
                }
            });
            if(run){
                var filePath = path.join(__dirname, "../../uploads/"+fileObject.filename);
                res.setHeader('Content-type', fileObject.mimetype)
                res.download(filePath);
                
            }else{
                res.send(HelpingFunctions.failureResponse("File Not found"))
            }
        }, HelpingFunctions.handleError(res))
    }
    private addAttachment(req: Request, res : Response){
        var teacherId = req['decoded']._doc._id;
         var id = req.params.courseId
         console.log("here")
        var model = DatabaseConnection.getModels()
        model.course.findById(id).exec().then(course=>{
            if(course !=null){
                console.log(req['file'])
                course.attachments.push(req['file']);
                course.save().then(newCourse=>{
                    res.send(HelpingFunctions.successResponse("Attachment added!", newCourse)) 
                }, HelpingFunctions.handleError(res))
            }else{
                res.send(HelpingFunctions.failureResponse("Course Not Found"));
            }
        }, HelpingFunctions.handleError(res))
    }
    private getCourses(req : Request, res: Response){
        var usertype = req['decoded']._doc.type;
        var model = DatabaseConnection.getModels()
        var JSON = {}
        if(usertype == USER_TYPE.TEACHER){
            JSON['teacher']= req['decoded']._doc._id 
        }else if(usertype == USER_TYPE.STUDENT){
            JSON['students'] = req['decoded']._doc._id
        }

        model.course.find(JSON).exec().then(courses=>{
            res.send(HelpingFunctions.successResponse("Courses", courses));
        }, HelpingFunctions.handleError(res))
    }
    private addCourse(req: Request, res : Response){
        var model = DatabaseConnection.getModels()
        var courseName = req.body.name
        var course = new model.course({
            name : courseName,
            teacher :   req['decoded']._doc._id,
            students : [] 
        })
        course.save().then(newCourse=>{
            res.send(HelpingFunctions.successResponse("Course Added", newCourse));
        }, HelpingFunctions.handleError(res))
    }
    private addStudentToCourse(req: Request, res : Response){
        var id = req.params.courseId
        var model = DatabaseConnection.getModels()
        model.course.findById(id).exec().then(course=>{
            if(course != null){
                course.students.push(req['decoded']._doc._id);
                course.save().then(output=>{
                    res.send(HelpingFunctions.successResponse("Assigned to the course!", output))
                }, HelpingFunctions.handleError(res))
            }else{
                res.send(HelpingFunctions.failureResponse("Error! Course not found"))
            }
        }, HelpingFunctions.handleError(res))
    }

}