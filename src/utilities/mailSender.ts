import { DatabaseConnection } from '../utilities/databaseconnection';
import {Router, Request, Response} from "express";
import { HelpingFunctions } from './helpingFunctions';
const nodemailer = require('nodemailer');

export class MailSender{
   
   public static sendMail (res: Response, email : String){

        var model = DatabaseConnection.getModels();
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true, // use SSL
            auth: {
                user: 'colgatefolio3@gmail.com',
                pass: 'colgatefolio3@'
            },
            tls: { rejectUnauthorized: false }
        };
        var transporter = nodemailer.createTransport(smtpConfig);

        model.user.find({"email" : email}).exec().then(user=>{
            var tempUser: any = user[0]
            var temp = tempUser._id
            let mailOptions = {
                from: 'colgatefolio3@gmail.com', // sender address
                to: email, // list of receivers
                subject: 'Account Verification', // Subject line
                html: '<h1> Code : '+temp.toString()+'</h1>'// plain text body
            };
            
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.send(HelpingFunctions.successResponse("Mail has been delivered", null));
            });    
        })
    }
}