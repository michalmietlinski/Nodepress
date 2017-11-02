'use strict';
const nodemailer = require('nodemailer');

// create reusable transporter object using the default SMTP transport
let transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'testnodetestnode@gmail.com',
        pass: 'testnode00'
    }
});

// setup email data with unicode symbols
let mailOptions = {
    from: 'testnodetestnode@gmail.com', // sender address
    to: 'mietlinski.michal.priv@gmail.com', // list of receivers
    subject: 'Hello ', // Subject line
    text: 'Hello world ?', // plain text body
    html: '<b>Hello world ?</b>' // html body
};

// send mail with defined transport object
let test=function(content){
    mailOptions.html=content;
    mailOptions.text=content;
transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
        return console.log(error);
    }
    console.log('Message %s sent: %s', info.messageId, info.response);
});
}

module.exports=test