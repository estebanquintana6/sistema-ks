
const moment = require('moment')

module.exports = {
    isToday: function(date){
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    },
    hasExpired: function(date){
        const due_date = moment(date).startOf('day');
        const today = moment().startOf('day');
        return due_date.isSame(today);
    },
    willExpireFive: function(date){
        return moment(date).startOf('day').isSame(moment().clone().add(5,'days').startOf('day'))
    },
    willExpireTen: function(date){
        return moment(date).startOf('day').isSame(moment().clone().add(10,'days').startOf('day'))
    },
    isSameDay: function(date1, date2) {
        return date1.getDate() === date2.getDate() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getFullYear() === date2.getFullYear();
    },
    substractYears: function(date, years) {
        let result = new Date();

        result.setFullYear(date.getFullYear() - years);
        result.setDate(date.getDate());
        result.setMonth(date.getMonth());

        return result;
    },
    daysFromNow: function(numberOfDays){
        return moment().clone().startOf('day').add(numberOfDays, 'days').toDate()
    }
}
