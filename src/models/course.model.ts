import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { ICourse, ICourseDocument } from '../interfaces/course.interface';
import { Schema } from "mongoose";

export interface ICourseModel extends mongoose.Model<ICourseDocument> {
  //custom methods for your model would be defined here
}

export var courseSchema: Schema = new Schema({
    name : String, 
    teacher : {type : mongoose.Schema.Types.ObjectId, refs : 'User'},
    students: [{type : mongoose.Schema.Types.ObjectId, refs : 'User'} ],
    attachments: [ 
      { 
        fieldname: String,
        originalname: String,
        encoding: String,
        mimetype: String,
        destination: String,
        filename: String,
        path: String,
        size: Number  
      }]
});

