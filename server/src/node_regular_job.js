const schedule = require('node-schedule');
const moment = require('moment')

const Invoice = require("./models/InvoiceForm");
const User = require("./models/UserForm");
const { hasExpired, willExpire } = require('./utils/dateUtils');

const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'user',
    pass: 'password'
  }
});

const mailOptions =  (invoice, users, language, situation) => {
    const destinations = []
    destinations.push(invoice.client.contacts.map(contact => contact.email))
    destinations.push(invoice.email)
    const userEmails = users.map(user => user.email)
    destinations.push(userEmails)

    let subjectText = ''
    let languageText = ''

    if (language === 'coreano'){
      if (situation === 'vencido'){
        subjectText = `Pago de recibo ${invoice.invoice} VENCIDO`
        languageText = `Estimado ${invoice.client.name}: \n El pago de su recibo ${invoice.invoice} con vencimiento ${moment(invoice.due_date).format('DD/MM/YYYY')} requiere de su pago por un monto de ${invoice.bounty} ${invoice.insurance.currency}. Gracias.`
      } else {
        subjectText = `Recordatorio: Pago de recibo ${invoice.invoice}`
        languageText = `Estimado ${invoice.client.name}: \n El pago de su recibo ${invoice.invoice} vencerá el día ${moment(invoice.due_date).format('DD/MM/YYYY')} le sugerimos su pago oportuno por un monto de ${invoice.bounty} ${invoice.insurance.currency}. Gracias.`
      }
    } else {
      if (situation === 'vencido'){
        subjectText = `Pago de recibo ${invoice.invoice} VENCIDO`
        languageText = `Estimado ${invoice.client.name}: \n El pago de su recibo ${invoice.invoice} con vencimiento ${moment(invoice.due_date).format('DD/MM/YYYY')} requiere de su pago por un monto de ${invoice.bounty} ${invoice.insurance.currency}. Gracias.`
      } else {
        subjectText = `Recordatorio: Pago de recibo ${invoice.invoice}`
        languageText = `Estimado ${invoice.client.name}: \n El pago de su recibo ${invoice.invoice} vencerá el día ${moment(invoice.due_date).format('DD/MM/YYYY')} le sugerimos su pago oportuno por un monto de ${invoice.bounty} ${invoice.insurance.currency}. Gracias.`
      }
    }

    return {
        from: 'email',
        to: destinations.join(','),
        subject: subjectText,
        text: languageText
    }
};

const func = (invoice, users, language, situation) => transporter.sendMail(mailOptions(invoice, users, language, situation), function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});


var j = schedule.scheduleJob('*/5 * * * * *', function(){
    var statuses = ['PENDIENTE', 'VENCIDO']
    Invoice.find({payment_status: {$in: statuses}}).populate('insurance').populate('client').then((invoices, err) => {
        User.find({}).then((users) => {
            invoices.filter(invoice => {
                let due_date = new Date(invoice.due_date);
                if(hasExpired(due_date)) return invoice;
                else if(willExpire(due_date)) return invoice;
            }).map(invoice => {return {invoice, method: hasExpired(invoice.due_date) ? 'vencido' : 'proximo'}}).map((invoice) => {
                const lang = invoice.invoice.client.languages
                if (lang !== 'Coreano') //func(invoice.invoice, users, 'Español', invoice.method)
                if (lang !== 'Español') //func(invoice.invoice, users, 'Coreano', invoice.method)
                console.log(invoice._id);
            });
        })
    })
})