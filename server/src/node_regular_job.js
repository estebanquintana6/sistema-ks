const schedule = require('node-schedule');
const moment = require('moment')

const Invoice = require("./models/InvoiceForm");
const User = require("./models/UserForm");
const { isToday } = require('./utils/dateUtils');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'email',
    pass: 'passord'
  }
});

const mailOptions =  (invoice, users, language) => {
    const destinations = []
    destinations.push(invoice.client.contacts.map(contact => contact.email))
    const userEmails = users.map(user => user.email)
    destinations.push(userEmails)
    const subjectText = language === 'Coreano' ? `mi hau nai ${invoice.invoice}` : `Pago de recibo ${invoice.invoice}`
    const languageText = language === 'Coreano' ? `mi hau nai ${invoice.invoice} sapporo king king king wuhan kinai ` : `Estimado ${invoice.client.name}: \n El pago de su recibo ${invoice.invoice} con vencimiento ${moment(invoice.due_date).format('DD/MM/YYYY')} y fecha límite de pago ${moment(invoice.pay_limit).format('DD/MM/YYYY')} requiere de su pago por un monto de ${invoice.insurance.bounty} ${invoice.insurance.currency}. Gracias.`
    return {
        from: 'email',
        to: destinations.join(','),
        subject: subjectText,
        text: languageText
    }
};

const func = (invoice, users, language) => transporter.sendMail(mailOptions(invoice, users, language), function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


var j = schedule.scheduleJob('*/5 * * * * *', function(){    
    Invoice.find().populate('insurance').populate('client').then((invoices, err) => {
        User.find({}).then((users) => {
            invoices.filter( (invoice) => {
                let due_date = new Date(invoice.due_date);
                let pay_limit = new Date(invoice.pay_limit);
                if(isToday(due_date)) return invoice;
                else if(isToday(pay_limit)) return invoice;
            }).map((invoice) => {
                const lang = invoice.client.languages
                if (lang !== 'Coreano') //func(invoice, users, 'Español')
                if (lang !== 'Español') //func(invoice, users, 'Coreano')
                console.log(invoice._id);
            });
        })
    })
})