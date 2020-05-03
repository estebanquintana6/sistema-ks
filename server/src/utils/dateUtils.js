
module.exports = {
    isToday: function(date){
        const today = new Date();
        return date.getDate() === today.getDate() &&
            date.getMonth() === today.getMonth() &&
            date.getFullYear() === today.getFullYear();
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
