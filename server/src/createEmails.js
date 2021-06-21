var express = require('express');
var router = express.Router();
const Email = require("./models/EmailForm");

const createEmail = (lang) => {
    const email = new Email({
        language: lang,
        reminderEmail: {
            header: "",
            content: ""
        },
        lapsedEmail: {
            header: "",
            content: ""
        }
    })

    Email.findOne({ language: lang }).then(res => {
        const exists = res;
        if (exists) return;
        email.save().then((result) => {
            console.log('EMAIL CREATED', result);
        })
    })
}
const intializeEmails = () => {
    createEmail('ESPANOL')
    createEmail('COREANO')
}

module.exports = intializeEmails