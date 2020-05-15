const schedule = require('node-schedule');
const moment = require('moment')

const Invoice = require("./models/InvoiceForm");
const User = require("./models/UserForm");
const Company = require("./models/CompanyForm");

const { hasExpired, willExpireFive, willExpireTen } = require('./utils/dateUtils');

const nodemailer = require('nodemailer');

let companies;

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ''
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
  - Contratante:	${invoice.client.name}
  - Aseguradora: ${company.name}
  - No de poliza: ${invoice.insurance.policy}
  - Tipo de poliza: ${invoice.insurance.insurance_type}
  - No. Recibo: ${invoice.invoice}
  - Prima: ${invoice.bounty}
  - Fecha de vencimiento: ${moment(invoice.due_date).format('DD/MM/YYYY')}
  - Moneda ${invoice.insurance.currency}
  `
}

const composeInvoiceDetailsCorean = (invoice) => {
  
  return `\n\n
  정책 정보: \n
  - 계약자	${invoice.client.name}
  - 보험 회사	${invoice.insurance.company}
  - 정책 번호 ${invoice.insurance.policy}
  - 정책 유형 ${invoice.insurance.insurance_type}
  - 영수증 번호 ${invoice.invoice}
  - 공유 ${invoice.bounty}
  -	마감일 ${moment(invoice.due_date).format('DD/MM/YYYY')}
  - 통화 ${invoice.insurance.currency}
  `
}

const mailOptions =  (invoice, users, language, situation) => {
    console.log('MANDANDO', language)
    const destinations = []
    // para enviar a los contactos del cliente
    // destinations.push(invoice.client.contacts.map(contact => contact.email))
    // splittear correos y meter
    invoice.email.split(',').forEach(element => {
      destinations.push(element)
    });
    const userEmails = users.map(user => user.email)
    destinations.push(userEmails)

    let subjectText = ''
    let languageText = ''

    if (language === 'Coreano'){
      if (situation === 'vencido'){
        subjectText = `워드로 메일 내용 줄것`
        languageText = `안녕하세요.
        \n항상 평안하시고 건강하시기를 바랍니다.
        \n다름이 아니라  보험료 납부기간이 지나 보험효력지 중지 상태임을 알려드립니다. 지금 납부를 하시면 보험을 다시 되살릴수 있습니다 납부를 원하시면 연락을 주시기 바랍니다. 만약 페이가 되었다면 납부한 증빙서를 보내주시기 바랍니다
        \n감사합니다 편안한 하루 되시기 바랍니다`
      } else if(situation === 'proximo5'){
        subjectText = `워드로 메일 내용 줄것`
        languageText = `안녕하세요.
        \n항상 평안하시고 건강하시기를 바랍니다.
        \n다름이 아니라  보험료 납부기간이 얼마남지(5일) 않아 알려드립니다. 기간내에 납부가 될수 있도록 부탁드립니다 만약 페이가 되었다면 납부한 증빙서를 보내주시기 바랍니다 .
        \n감사합니다 편안한 하루 되시기 바랍니다`
      }else if(situation === 'proximo10'){
        subjectText = `워드로 메일 내용 줄것`
        languageText = `안녕하세요.
        \n항상 평안하시고 건강하시기를 바랍니다.
        \n다름이 아니라  보험료 납부기간이 얼마남지(10일)  않아 알려드립니다. 기간내에 납부가 될수 있도록 부탁드립니다 만약 페이가 되었다면 납부한 증빙서를 보내주시기 바랍니다.
        \n감사합니다 편안한 하루 되시기 바랍니다`
      }
    } else {
      if (situation === 'vencido'){
        subjectText = `Pago de recibo ${invoice.invoice} VENCIDO`
        languageText = `Buen día Estimado cliente,\n
        Nos dirijimos a usted para notificarle que se venció la fecha límite
        de pago de su póliza, por lo que en caso de siniestro estaría sin cobertura.
        Solicitamos de su apoyo con el comprobante de pago para poder rehabilitar la póliza lo antes posible.
        Agradecemos su preferencia. 
        \nSaludos cordiales.`
      } else if(situation === 'proximo5'){
        subjectText = `Pago de recibo ${invoice.invoice} próximo a vencer`
        languageText = `Buen día Estimado cliente,\n
        Nos dirijimos a usted para recordarle que el pago de  ésta póliza 
        esta próximo a vencer por lo que solicitamos de su valioso apoyo con el comprobante de pago.
        Agradecemos su preferencia.
        \nSaludos cordiales`
      }else if(situation === 'proximo10'){
        subjectText = `Pago de recibo ${invoice.invoice} próximo a vencer`
        languageText = `Buen día Estimado cliente,\n
        Le enviamos éste correo como recordatorio para el pago de ésta póliza, 
        solicitamos de su valioso apoyo con el comprobante del mismo. 
        Seguimos a sus órdenes.
        \nSaludos cordiales.`
      }
    }
    if(language === 'Coreano'){
      languageText += composeInvoiceDetailsCorean(invoice)
    }else{
      languageText += composeInvoiceDetailsSpanish(invoice)
    }

    // console.log('EMAIL TO SEND', languageText, language)
    return {
        from: '',
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

const chooseMethod = (date) => {
  if(hasExpired(date)) return 'vencido';
  if(willExpireFive(date)) return 'proximo5'
  if(willExpireTen(date)) return 'proximo10'
}


var j = schedule.scheduleJob('*/20 * * * * *', async function(){
    var statuses = ['PENDIENTE', 'VENCIDO'];
    
    companies = await Company.find().exec();

    Invoice.find({payment_status: {$in: statuses}}).populate('insurance').populate('client').then((invoices, err) => {


      User.find({}).then((users) => {
          invoices.filter(invoice => {
              let due_date = new Date(invoice.due_date);
              if(hasExpired(due_date)) return invoice;
              else if(willExpireTen(due_date)) return invoice;
          }).map(invoice => {
            return {invoice, method: chooseMethod(invoice.due_date)}
          })
          .map((invoice) => {
              const lang = invoice.invoice.client.languages
              if (lang !== 'Coreano') //func(invoice.invoice, users, 'Español', invoice.method)
              if (lang !== 'Español') //func(invoice.invoice, users, 'Coreano', invoice.method)
              return true
          });
      })
  })
})