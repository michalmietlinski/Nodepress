"use strict";
const path = require('path');
const appDir = path.dirname(require.main.filename);
const nodemailer = require('nodemailer');
class singleHandler {
    constructor(parent, config) {
      this._parent = parent;
        this.config = config;
        // create reusable transporter object using the default SMTP transport
        this._transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'testnodetestnode@gmail.com',
                pass: 'testnode00'
            }
        });

        // setup email data with unicode symbols
        this._mailOptions = {
            from: 'testnodetestnode@gmail.com', // sender address
            to: 'mietlinski.michal.priv@gmail.com' // list of receivers

        };

    }
    init() {
        this.sendMail = this.sendMailfunct(this)
    }

    // send mail with defined transport object
    sendMailfunct(instance) {
        return function(content, subject) {
            let mailOptions = instance._mailOptions;
            mailOptions.html = content;
            mailOptions.text = content;
            mailOptions.subject = subject;
            instance._transporter.sendMail(mailOptions, (error, info) => {
                if (error) {
                    return console.log(error);
                }
                console.log('Message %s sent: %s', info.messageId, info.response);
            });
        }
    }

}


module.exports = singleHandler