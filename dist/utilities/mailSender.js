"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const databaseconnection_1 = require("../utilities/databaseconnection");
const helpingFunctions_1 = require("./helpingFunctions");
const nodemailer = require('nodemailer');
class MailSender {
    static sendMail(res, email) {
        var model = databaseconnection_1.DatabaseConnection.getModels();
        var smtpConfig = {
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: 'vishalfreelancing32@gmail.com',
                pass: 'Freelancing'
            },
            tls: { rejectUnauthorized: false }
        };
        var transporter = nodemailer.createTransport(smtpConfig);
        model.user.find({ "email": email }).exec().then(user => {
            var tempUser = user[0];
            var temp = tempUser._id;
            let mailOptions = {
                from: 'colgatefolio3@gmail.com',
                to: email,
                subject: 'Account Verification',
                html: '<h1> Code : ' + temp.toString() + '</h1>'
            };
            transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
                res.send(helpingFunctions_1.HelpingFunctions.successResponse("Mail has been delivered", null));
            });
        });
    }
}
exports.MailSender = MailSender;
