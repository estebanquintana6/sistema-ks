import moment from 'moment'

export const formatShortDate = (date) => {
  const days = date.split('T')[0]
  return moment(days).startOf('day').format('DD/MM/YYYY')
}
export const changeLocation = (history, route) => history.push(route);