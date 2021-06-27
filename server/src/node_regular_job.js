const schedule = require('node-schedule');
const moment = require('moment');
const config = require('./config/email');

const Invoice = require("./models/InvoiceForm");
const Company = require("./models/CompanyForm");
const InsuranceType = require("./models/InsuranceTypeForm");
const Email = require("./models/EmailForm");

const {
  hasExpired,
  willExpireFive,
  willExpireTen,
  daysFromNow
} = require('./utils/dateUtils');

const nodemailer = require('nodemailer');

let companies;
let spanishEmail;
let coreanEmail;

Array.prototype.unique = function () {
  var a = this.concat();
  for (var i = 0; i < a.length; ++i) {
    for (var j = i + 1; j < a.length; ++j) {
      if (a[i] === a[j])
        a.splice(j--, 1);
    }
  }

  return a;
};

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.email,
    pass: config.emailpass
  }
});

const composeInvoiceDetailsSpanish = (invoice) => {
  let invoiceId = invoice.insurance.insurance_company;

  const companyFiltered = companies.filter((company) => {
    let companyId = company._id;
    return invoiceId.equals(companyId);
  });

  let company = companyFiltered[0];

  return `\n\n
  Datos de la Póliza: \n
  - Contratante: ${invoice?.client?.name}
  - Aseguradora: ${company?.name}
  - No de poliza: ${invoice?.insurance?.policy}
  - Tipo de poliza: ${invoice?.insurance?.insurance_type}
  - No. Recibo: ${invoice?.invoice}
  - Prima: ${invoice?.bounty}
  - Fecha de vencimiento: ${moment(invoice?.due_date).format('DD/MM/YYYY')}
  - Moneda: ${invoice?.insurance?.currency}
  `
}

const composeInvoiceDetailsCorean = (invoice) => {
  let invoiceId = invoice.insurance.insurance_company;

  const companyFiltered = companies.filter((company) => {
    let companyId = company._id;
    return invoiceId.equals(companyId);
  });

  let company = companyFiltered[0];

  return `\n\n
  정책 정보: \n
  - 계약자: ${invoice?.client?.name}
  - 보험 회사: ${company?.name}
  - 정책 번호: ${invoice?.insurance?.policy}
  - 정책 유형: ${invoice?.insurance?.insurance_type}
  - 영수증 번호: ${invoice?.invoice}
  - 공유: ${invoice?.bounty}
  -	마감일: ${moment(invoice?.due_date).format('DD/MM/YYYY')}
  - 통화: ${invoice?.insurance?.currency}
  `
}

const mailOptions = (invoice, situation, destinations) => {
  const language = invoice.client.languages || "Español";
  const insuranceType = invoice.insurance.insurance_type;

  let subjectText = ''
  let languageText = ''

  if (language === 'Coreano') {
    if (situation === 'vencido') {
      subjectText = coreanEmail.lapsedEmail.header;
      languageText = coreanEmail.lapsedEmail.content;
    } else {
      subjectText = coreanEmail.reminderEmail.header;
      languageText = coreanEmail.reminderEmail.content;
    }
  } else {
    if (situation === 'vencido') {
      subjectText = spanishEmail.lapsedEmail.header;
      languageText = spanishEmail.lapsedEmail.content;
    }
    else {
      subjectText = spanishEmail.reminderEmail.header;
      languageText = spanishEmail.reminderEmail.content;
    }
  }

  if (language === 'Coreano') {
    languageText += composeInvoiceDetailsCorean(invoice)
  } else {
    languageText += composeInvoiceDetailsSpanish(invoice)
  }
  if (invoice.email_comment) {
    languageText += `\n\nComentario email: ${invoice.email_comment}`
  }

  return {
    from: config.email,
    to: destinations.join(','),
    subject: subjectText,
    text: languageText
  }
};

const func = (invoice, situation) => {
  try {
    if (invoice.email == undefined) return
    if (invoice.email.replace(/(\r\n|\n|\r)/gm, "") === '') return

    let insuranceType = "";
    switch (invoice.insurance.insurance_type) {
      case "AUTOS":
        insuranceType = "AUTO";
        break;
      case "DANOS":
        insuranceType = "DAÑOS";
        break;
      case "GM":
        insuranceType = "GMM";
        break;
      case "VIDA":
        insuranceType = "VIDA";
        break;
      default:
        insuranceType = "";
    }

    InsuranceType.findOne({ name: insuranceType }).then((insurance_type) => {
      // para enviar a los contactos del cliente
      // destinations.push(invoice.client.contacts.map(contact => contact.email))
      // splittear correos y meter  
      const regex = /\S+[a-z0-9]@[a-z0-9\.]+/img

      const emails = invoice.email.match(regex).concat(insurance_type.emails).unique();
      transporter.sendMail(mailOptions(invoice, situation, emails), function (error, info) {
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      })
    });
  } catch (error) {
    console.log(`${invoice.invoice} failed to send message. Error: `)
    console.log(error);
  }
};

var myRule = {
  "hour": 13,
  "minute": 0,
};

var j = schedule.scheduleJob(myRule, async function () {
  companies = await Company.find().exec();
  spanishEmail = await Email.findOne({ language: 'ESPANOL' }).exec();
  coreanEmail = await Email.findOne({ language: 'COREANO' }).exec();

  Invoice.find({ payment_status: 'PENDIENTE' }).populate('insurance').populate('client').then((invoices, err) => {

    console.log("Elementos pendientes de pago:", invoices.length);

    const vencidos = invoices.filter((invoice) => {
      return hasExpired(invoice.due_date)
    }).map((invoice) => {
      func(invoice, 'vencido')

      Invoice.updateOne({ "_id": invoice._id }, { "payment_status": "VENCIDO" }).exec();
      return true
    });

    const recordatorios_5 = invoices.filter((invoice) => {
      return willExpireFive(invoice.due_date) && !invoice.bounty.includes('-');
    }).map((invoice) => {
      func(invoice, 'proximo5')
    });

    const recordatorios_10 = invoices.filter((invoice) => {
      return willExpireTen(invoice.due_date) && !invoice.bounty.includes('-');
    }).map((invoice) => {
      console.log(invoice.due_date);
      func(invoice, 'proximo10');
    })

    console.log("Elementos vencidos:", vencidos.length);
    console.log("Elementos a vencer en 5 dias:", recordatorios_5.length);
    console.log("Elementos a vencer en 10 dias:", recordatorios_10.length);

  })

})