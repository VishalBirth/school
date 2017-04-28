import * as mongoose from 'mongoose';

export interface IUser {
    createdAt: Date;
    email : string;
    username : string;
    type : number;
    isActive : boolean;
    password : string;
}

export interface IUserDocument extends  IUser, mongoose.Document {

}