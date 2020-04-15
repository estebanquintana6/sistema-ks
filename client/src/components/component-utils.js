import moment from 'moment'

export const formatShortDate = (date) => moment(date).format('YYYY-MM-DD')
export const changeLocation = (history, route) => history.push(route);