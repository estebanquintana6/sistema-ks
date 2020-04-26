import moment from 'moment'

export const formatShortDate = (date) => {
  const days = date.split('T')[0]
  console.log('days 1', days)
  return moment(days).startOf('day').format('DD/MM/YYYY')
}
export const changeLocation = (history, route) => history.push(route);