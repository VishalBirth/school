import * as mongoose from 'mongoose';

export interface ICourse {
    name : String;
    teacher : mongoose.Types.ObjectId;
    students: [ mongoose.Types.ObjectId ];
    attachments: [ 
      { 
        fieldname: string,
        originalname: string,
        encoding: string,
        mimetype: string,
        destination: string,
        filename: string,
        path: string,
        size: Number  
      }]
}

export interface ICourseDocument extends  ICourse, mongoose.Document {

}