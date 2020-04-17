import moment from 'moment'

export const formatShortDate = (date) => moment(date).format('DD/MM/YYYY')
export const changeLocation = (history, route) => history.push(route);