export interface ICountry {
  name: string
  iso2: string
  format: string
  dialCode: string
  priority: number
}

const resolvePhoneNumber = (country: ICountry, input: string) => {
  if (input.length < 4) {
    return
  }

  const cleanNumber = input.replace(/[^\d+]/g, '')
  if (!cleanNumber) {
    return
  }

  if (cleanNumber.length < 8) {
    return
  }

  if (input[0] === '+') {
    return cleanNumber
  }

  return `+${country.dialCode}${cleanNumber}`
}

const isPhoneNumberValid = (phoneNumber?: string | null) =>
  new RegExp(/^[+]*([-\s\./0-9]*)+$/).test(`${phoneNumber || ''}`)

export const validateNumber = (country: ICountry, input: string) => {
  const phoneNumber = resolvePhoneNumber(country, input)

  if (phoneNumber && isPhoneNumberValid(phoneNumber)) {
    return phoneNumber
  }

  return undefined
}
