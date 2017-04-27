"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HelpingFunctions {
    static failureResponse(output) {
        return {
            status: "failure",
            message: output
        };
    }
    static successResponse(output, data) {
        return {
            status: "success",
            message: output,
            data: data
        };
    }
    static successResponseWithToken(output, data, token) {
        return {
            status: "success",
            message: output,
            data: data,
            token: token
        };
    }
    static handleError(res) {
        return (err) => {
            res.send(HelpingFunctions.failureResponse("Error!"));
        };
    }
    static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }
}
exports.HelpingFunctions = HelpingFunctions;
