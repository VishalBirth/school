"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
exports.userSchema = new mongoose_1.Schema({
    createdAt: Date,
    email: { type: String, required: true, lowercase: true },
    password: { type: String, required: true },
    isActive: { type: Boolean, default: false },
    type: Number
});
exports.userSchema.pre("save", function (next) {
    if (!this.createdAt) {
        this.createdAt = new Date();
    }
    next();
});
exports.userSchema.statics.findAll = function () {
    return this.find();
};
