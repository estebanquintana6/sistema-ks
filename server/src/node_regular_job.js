const schedule = require('node-schedule');
const moment = require('moment');
const config = require('./config/email');

const Invoice = require("./models/InvoiceForm");
const Company = require("./models/CompanyForm");
const InsuranceType = require("./models/InsuranceTypeForm");

const { hasExpired, willExpireFive, willExpireTen, daysFromNow } = require('./utils/dateUtils');

const nodemailer = require('nodemailer');

let companies;

Array.prototype.unique = function() {
  var a = this.concat();
  for(var i=0; i<a.length; ++i) {
      for(var j=i+1; j<a.length; ++j) {
          if(a[i] === a[j])
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
  - Contratante: ${invoice.client.name}
  - Aseguradora: ${company.name}
  - No de poliza: ${invoice.insurance.policy}
  - Tipo de poliza: ${invoice.insurance.insurance_type}
  - No. Recibo: ${invoice.invoice}
  - Prima: ${invoice.bounty}
  - Fecha de vencimiento: ${moment(invoice.due_date).format('DD/MM/YYYY')}
  - Moneda: ${invoice.insurance.currency}
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
  - 계약자: ${invoice.client.name}
  - 보험 회사: ${company.name}
  - 정책 번호: ${invoice.insurance.policy}
  - 정책 유형: ${invoice.insurance.insurance_type}
  - 영수증 번호: ${invoice.invoice}
  - 공유: ${invoice.bounty}
  -	마감일: ${moment(invoice.due_date).format('DD/MM/YYYY')}
  - 통화: ${invoice.insurance.currency}
  `
}

const mailOptions =  (invoice, situation, destinations) => {
    const language = invoice.client.languages || "Español";
    const insuranceType = invoice.insurance.insurance_type;

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
      if(insuranceType === "AUTOS"){
        if (situation === 'vencido'){
          subjectText = `Pago de recibo ${invoice.invoice} VENCIDO`
          languageText = `Buen día Estimado cliente,\n
          Nos dirijimos a usted para notificarle que se venció la fecha límite de pago de su póliza, por lo que en caso de siniestro estaría sin cobertura. Solicitamos de su apoyo con el comprobante de pago para poder rehabilitar la póliza lo antes posible. Agradecemos su preferencia. Saludos cordiales.`
        }
        if(situation === "proximo5" || situation === 'proximo10'){
          subjectText = `Pago de recibo ${invoice.invoice} próximo a vencer`
          languageText = `Buen día Estimado cliente, \n
          Le enviamos éste correo como recordatorio para el pago de ésta póliza, solicitamos de su valioso apoyo con el comprobante del mismo. Seguimos a sus órdenes. Saludos cordiales.`
        }
      } else {
        if (situation === 'vencido'){
          subjectText = `Pago de recibo ${invoice.invoice} VENCIDO`
          languageText = `Por medio del presente me permito informarle que su recibo: ${invoice.invoice} venció el día: ${moment(invoice.due_date).format('DD/MM/YYYY')} a las 12:00pm, por lo que a partir de dicho momento queda sin cobertura las familias correspondientes a tu recibo antes mencionado. \n
          Si usted realizo su pago favor de hacernos llegar su comprobante, o ponerse en contacto con el equipo de KS SEGUROS, agradecemos su gran apoyo y confianza.`
        } 
          else if(situation === 'proximo5'){
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
    }
    if(language === 'Coreano'){
      languageText += composeInvoiceDetailsCorean(invoice)
    } else {
      languageText += composeInvoiceDetailsSpanish(invoice)
    }

    return {
        from: config.email,
        to: destinations.join(','),
        subject: subjectText,
        text: languageText
    }
};

const func = (invoice, situation) => {
  if(invoice.email.replace(/(\r\n|\n|\r)/gm,"") === '') return

  let insuranceType = "";
  switch(invoice.insurance.insurance_type){
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

  InsuranceType.findOne({name: insuranceType}).then((insurance_type) => {
    // para enviar a los contactos del cliente
    // destinations.push(invoice.client.contacts.map(contact => contact.email))
    // splittear correos y meter  
    const regex = /\S+[a-z0-9]@[a-z0-9\.]+/img

    const emails = invoice.email.match(regex).concat(insurance_type.emails).unique();
    console.log(emails);
    transporter.sendMail(mailOptions(invoice, situation, emails), function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    })
  });
};

var myRule = {"hour": 13, 
  "minute": 0,
};

var j = schedule.scheduleJob(myRule, async function(){    
    companies = await Company.find().exec();

    Invoice.find({payment_status: 'PENDIENTE'}).populate('insurance').populate('client').then((invoices, err) => {

      console.log("Elementos pendientes de pago:", invoices.length);

      const vencidos = invoices.filter((invoice) => {
        return hasExpired(invoice.due_date)
      }).map((invoice) => {
        func(invoice, 'vencido')

        Invoice.updateOne({"_id": invoice._id}, {"payment_status": "VENCIDO"}).exec();
        return true
    });

    const recordatorios_5 = invoices.filter((invoice) => {
      return willExpireFive(invoice.due_date);
    }).map((invoice) => {
      func(invoice, 'proximo5')
    });

    const recordatorios_10 = invoices.filter((invoice) => {
      return willExpireTen(invoice.due_date);
    }).map((invoice) => {
      console.log(invoice.due_date);
      func(invoice, 'proximo10');
    })

      console.log("Elementos vencidos:", vencidos.length);
      console.log("Elementos a vencer en 5 dias:", recordatorios_5.length);
      console.log("Elementos a vencer en 10 dias:", recordatorios_10.length);

    })
    
})