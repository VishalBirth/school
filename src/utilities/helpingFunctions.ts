import {Router, Request, Response} from "express";

export class HelpingFunctions{
    public static failureResponse(output: String){
        return {
            status: "failure", 
            message : output
        }
    }
    public static successResponse( output: String, data :any){
        return {
            status: "success", 
            message : output, 
            data: data
        }
    }
    public static successResponseWithToken( output: String, data :any, token: any){
        return {
            status: "success", 
            message : output, 
            data: data, 
            token: token
        }
    }

    public static handleError(res : Response){
        return (err)=>{
            res.send(HelpingFunctions.failureResponse("Error!"))
        }
    }
    public static validateEmail(email) {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    }

    
}