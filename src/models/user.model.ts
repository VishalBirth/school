import { Document } from 'mongoose';
import * as mongoose from 'mongoose';
import { IUser, IUserDocument } from '../interfaces/user.interface';
import { Schema } from "mongoose";

export interface IUserModel extends mongoose.Model<IUserDocument> {
  //custom methods for your model would be defined here
  findAll() : mongoose.Query<IUserModel[]>
}

export var userSchema: Schema = new Schema({
    createdAt: Date,
    email : {type : String, required : true, lowercase :  true},
    password : {type : String, required: true}, 
    isActive : {type : Boolean, default: false}, 
    type: Number
});

userSchema.pre("save", function(next) {
  if (!this.createdAt) {
      this.createdAt = new Date();
  }
  next();
});

userSchema.statics.findAll = function() {
  return this.find();
}