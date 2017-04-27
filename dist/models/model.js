"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const user_model_1 = require("./user.model");
const course_model_1 = require("./course.model");
class ModelCreation {
    static createModels(connection) {
        var model = Object();
        model.user = (connection.model("User", user_model_1.userSchema));
        model.course = (connection.model("Course", course_model_1.courseSchema));
        return model;
    }
}
exports.ModelCreation = ModelCreation;
