import { Model, Connection } from 'mongoose';
import { IUserModel, userSchema } from "./user.model";
//importing schemas
import { ICourseModel, courseSchema } from "./course.model";


export interface IModel extends Object {
    user: IUserModel;
    course : ICourseModel;
}


export class ModelCreation {  
    public static createModels(connection : Connection ): IModel{
        var model : IModel = Object();

        // attaching models to the connection 
        model.user = <IUserModel>(connection.model("User",  userSchema))
        model.course = <ICourseModel>(connection.model("Course", courseSchema))
        return model;
    }
}