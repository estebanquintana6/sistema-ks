
const moment = require('moment')

module.exports = {
    isToday: function(date){
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
    },
    hasExpired: function(date){
        return moment(date).startOf('day').isSameOrBefore(moment().startOf('day'))
    },
    willExpireFive: function(date){
        return moment(date).startOf('day').isBetween(moment().startOf('day'), moment().clone().add(5,'days').startOf('day'), null, '[]')
    },
    willExpireTen: function(date){
        return moment(date).startOf('day').isBetween(moment().startOf('day'), moment().clone().add(10,'days').startOf('day'), null, '[]')
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
    }
}
