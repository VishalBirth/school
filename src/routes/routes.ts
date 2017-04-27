import * as express from 'Express';
import * as mongoose from 'mongoose';
import { DatabaseConnection } from '../utilities/databaseconnection';
import { IModel } from '../models/model';
import {Router, Request, Response} from "express";
import { API } from '../apis/api';
import { User } from '../apis/user.api';
import { Course } from "../apis/course.api";
var jwt    = require('jsonwebtoken');
var config = require("../../config.json") //import config file
var multer  = require('multer')
var upload = multer({ dest: 'uploads/' })


export class Routes{
    private router : express.Router
    constructor(){
        this.router = express.Router();  
        this.setRoutes(); 
    }

    private setRoutes(){
        this.router.use("/",(new API).getRouter());
        this.router.use("/user/", (new User).getRouter());     
        this.router.use(this.verifyToken) 
        
        this.router.use("/course/", (new Course).getRouter()); 
    }

    public getRouter(): express.Router{
        return this.router;
    }
    private verifyToken(req : Request, res :Response, next : any){

          // check header or url parameters or post parameters for token
          var token = req.body.token || req.query.token || req.headers['x-access-token'];
        
          // decode token
          if (token) {
        
            // verifies secret and checks exp
            jwt.verify(token, config.secret, function(err, decoded) {      
              if (err) {
                return res.json({ success: false, message: 'Failed to authenticate token.' });    
              } else {
                // if everything is good, save to request for use in other routes
                req['decoded'] = decoded;    
                next();
              }
            });
        
          } else {
        
            // if there is no token
            // return an error
            return res.status(403).send({ 
                success: false, 
                message: 'No token provided.' 
            });
            
          }
          
    }
    
}