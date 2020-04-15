const schedule = require('node-schedule');

const Invoice = require("./models/InvoiceForm");

let moment = require('moment');

var j = schedule.scheduleJob('50 * * * * *', function(){    
    Invoice.find().then((invoices, err) => {
        invoices.map((invoice) => {
            let invoiceDate = invoice.due_date[0];

            let y = moment(invoiceDate, "YYYY-MM-DD");

            console.log(invoice.due_date);
        });
    })
})