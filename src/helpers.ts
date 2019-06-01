import { parsePhoneNumber, CountryCode } from 'libphonenumber-js'

export interface ICountry {
  name: string
  iso2: string
  format: string
  dialCode: string
  priority: number
}

export const validateNumber = (country: ICountry, number: string) => {
  try {
    const phoneNumber = parsePhoneNumber(
      number,
      country.iso2.toUpperCase() as CountryCode
    )
    if (
      phoneNumber &&
      phoneNumber.isValid() &&
      phoneNumber.country === country.iso2.toUpperCase()
    ) {
      return phoneNumber.format('E.164')
    }

    return undefined
  } catch (e) {
    return undefined
  }
}
