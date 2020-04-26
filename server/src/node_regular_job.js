const schedule = require('node-schedule');

const Invoice = require("./models/InvoiceForm");
const { isToday } = require('./utils/dateUtils');


var j = schedule.scheduleJob('*/5 * * * * *', function(){    
    Invoice.find().populate('insurance').populate('client').then((invoices, err) => {
        invoices.filter( (invoice) => {
            let due_date = new Date(invoice.due_date);
            let pay_limit = new Date(invoice.pay_limit);
            if(isToday(due_date)) return invoice;
            else if(isToday(pay_limit)) return invoice;
        }).map((invoice) => {
            console.log(invoice._id);
        });
    })
})