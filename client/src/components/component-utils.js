import moment from 'moment'

export const formatShortDate = (date) => {
  const days = date.split('T')[0]
  return moment(days).startOf('day').format('DD/MM/YYYY')
}

export const formatDateObj = (date) => {
  const day = ("0" + date.getDate()).slice(-2)
  const month = ("0" + (date.getMonth() + 1)).slice(-2)


  return `${day}/${month}/${date.getFullYear()}`
}

export const changeLocation = (history, route) => history.push(route);