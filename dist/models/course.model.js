"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const mongoose_1 = require("mongoose");
exports.courseSchema = new mongoose_1.Schema({
    name: String,
    teacher: { type: mongoose.Schema.Types.ObjectId, refs: 'User' },
    students: [{ type: mongoose.Schema.Types.ObjectId, refs: 'User' }],
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
        }
    ]
});
