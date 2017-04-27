import { IUserModel } from '../models/user.model';
import * as express from 'Express';
import * as mongoose from 'mongoose';
import { DatabaseConnection } from '../utilities/databaseconnection';
import { IModel } from '../models/model';
import {Router, Request, Response} from "express";
import { HelpingFunctions } from '../utilities/helpingFunctions';
import { MailSender } from '../utilities/mailSender';
var config = require("../../config.json") //import config file

var jwt    = require('jsonwebtoken');
export class User{
    
    private router : express.Router
    
    constructor(){
        this.router = express.Router();  
        this.setRoutes(); 
    
    }
    public getRouter(): express.Router{
        return this.router;
    }
    private setRoutes(){
        this.router.get('/', this.getUsers);
        this.router.post('/', this.addUser);
        this.router.put('/:userId', this.activateUser);
        this.router.post('/login', this.loginUser);        

    }

    private getUsers(req : Request, res : Response){
        var model = DatabaseConnection.getModels();
        model.user.findAll().exec().then((output)=>{
            res.send(HelpingFunctions.successResponse("users", output));
        })
    }
    private activateUser(req: Request, res : Response){
        var userId = req.params.userId
        var model = DatabaseConnection.getModels();
        model.user.findByIdAndUpdate(userId, {$set: {isActive: true}}, {new: true}).exec().then(user=>{
            var token = jwt.sign(user, config.secret, {});
            res.send(HelpingFunctions.successResponseWithToken("Your account has been verified", user, token));
        })
    }
    private addUser(req: Request, res: Response){
        var username = req.body.username
        var email = req.body.email;
        var password = req.body.password;
        var usertype = req.body.usertype;
        if(typeof email != 'undefined' && HelpingFunctions.validateEmail(email)){
            var model = DatabaseConnection.getModels();
            model.user.findOne({email : email}).exec().then(userExist=>{
                if(userExist != null){
                    res.send(HelpingFunctions.failureResponse("Your account already exist"))
                }else{
                    var user = new model.user({
                        username: username,
                        email : email, 
                        password : password, 
                        type : usertype
                    })
                    user.save().then( output => {
                        MailSender.sendMail(res, email)
                    }, HelpingFunctions.handleError(res))
                }
            }, HelpingFunctions.handleError(res))
        }else{res.send(HelpingFunctions.failureResponse("Error"))}
    }
    private loginUser(req : Request, res : Response){
        var email = req.body.email
        var password = req.body.password
        var model = DatabaseConnection.getModels();
        if(typeof email == 'undefined'){
            res.send(HelpingFunctions.failureResponse("Error! no email"))
        }else{
            model.user.findOne({email : email}).exec().then(user=>{
                if(user.password == password){
                    var token = jwt.sign(user, config.secret, {});
                    // return the information including token as JSON
                    res.send(HelpingFunctions.successResponseWithToken("Logined",user, token))
                }else{
                    res.send(HelpingFunctions.failureResponse("wrong pass"))
                }
            }, HelpingFunctions.handleError(res))
        }
    }
}