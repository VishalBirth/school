"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("Express");
const api_1 = require("../apis/api");
const user_api_1 = require("../apis/user.api");
const course_api_1 = require("../apis/course.api");
var jwt = require('jsonwebtoken');
var config = require("../../config.json");
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });
class Routes {
    constructor() {
        this.router = express.Router();
        this.setRoutes();
    }
    setRoutes() {
        this.router.use("/", (new api_1.API).getRouter());
        this.router.use("/user/", (new user_api_1.User).getRouter());
        this.router.use(this.verifyToken);
        this.router.use("/course/", (new course_api_1.Course).getRouter());
    }
    getRouter() {
        return this.router;
    }
    verifyToken(req, res, next) {
        var token = req.body.token || req.query.token || req.headers['x-access-token'];
        if (token) {
            jwt.verify(token, config.secret, function (err, decoded) {
                if (err) {
                    return res.json({ success: false, message: 'Failed to authenticate token.' });
                }
                else {
                    req['decoded'] = decoded;
                    next();
                }
            });
        }
        else {
            return res.status(403).send({
                success: false,
                message: 'No token provided.'
            });
        }
    }
}
exports.Routes = Routes;
