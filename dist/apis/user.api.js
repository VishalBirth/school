"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("Express");
const databaseconnection_1 = require("../utilities/databaseconnection");
const helpingFunctions_1 = require("../utilities/helpingFunctions");
const mailSender_1 = require("../utilities/mailSender");
var config = require("../../config.json");
var jwt = require('jsonwebtoken');
class User {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }
    getRouter() {
        return this.router;
    }
    setRoutes() {
        this.router.get('/', this.getUsers);
        this.router.post('/', this.addUser);
        this.router.put('/:userId', this.activateUser);
        this.router.post('/login', this.loginUser);
    }
    getUsers(req, res) {
        var model = databaseconnection_1.DatabaseConnection.getModels();
        model.user.findAll().exec().then((output) => {
            res.send(helpingFunctions_1.HelpingFunctions.successResponse("users", output));
        });
    }
    activateUser(req, res) {
        var userId = req.params.userId;
        var model = databaseconnection_1.DatabaseConnection.getModels();
        model.user.findByIdAndUpdate(userId, { $set: { isActive: true } }, { new: true }).exec().then(user => {
            var token = jwt.sign(user, config.secret, {});
            res.send(helpingFunctions_1.HelpingFunctions.successResponseWithToken("Your account has been verified", user, token));
        });
    }
    addUser(req, res) {
        var username = req.body.username;
        var email = req.body.email;
        var password = req.body.password;
        var usertype = req.body.usertype;
        if (typeof email != 'undefined' && helpingFunctions_1.HelpingFunctions.validateEmail(email)) {
            var model = databaseconnection_1.DatabaseConnection.getModels();
            model.user.findOne({ email: email }).exec().then(userExist => {
                if (userExist != null) {
                    res.send(helpingFunctions_1.HelpingFunctions.failureResponse("Your account already exist"));
                }
                else {
                    var user = new model.user({
                        username: username,
                        email: email,
                        password: password,
                        type: usertype
                    });
                    user.save().then(output => {
                        mailSender_1.MailSender.sendMail(res, email);
                    }, helpingFunctions_1.HelpingFunctions.handleError(res));
                }
            }, helpingFunctions_1.HelpingFunctions.handleError(res));
        }
        else {
            res.send(helpingFunctions_1.HelpingFunctions.failureResponse("Error"));
        }
    }
    loginUser(req, res) {
        var email = req.body.email;
        var password = req.body.password;
        var model = databaseconnection_1.DatabaseConnection.getModels();
        if (typeof email == 'undefined') {
            res.send(helpingFunctions_1.HelpingFunctions.failureResponse("Error! no email"));
        }
        else {
            model.user.findOne({ email: email }).exec().then(user => {
                if (user.password == password) {
                    var token = jwt.sign(user, config.secret, {});
                    res.send(helpingFunctions_1.HelpingFunctions.successResponseWithToken("Logined", user, token));
                }
                else {
                    res.send(helpingFunctions_1.HelpingFunctions.failureResponse("wrong pass"));
                }
            }, helpingFunctions_1.HelpingFunctions.handleError(res));
        }
    }
}
exports.User = User;
