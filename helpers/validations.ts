const getDateError = (reason: string, label = '') => {
  console.log(reason)
  switch (reason) {
    case 'invalidDate':
      return { message: `${label} format is invalid` }

    case 'disablePast':
      return { message: `${label} must be a future date` }

    case 'maxDate':
      return { message: `${label} value is far in the future` }

    case 'minDate':
      return { message: `${label} value is far in the past` }

    default:
      return { message: `${label} value is invalid` }
  }
}

export { getDateError }
