import * as libphonenumber from 'google-libphonenumber'

const { PhoneNumberUtil, PhoneNumberFormat } = libphonenumber
const phoneUtil = PhoneNumberUtil.getInstance()
export interface ICountry {
  name: string
  iso2: string
  format: string
  dialCode: string
  priority: number
}

export const validateNumber = (country: ICountry, number: string) => {
  try {
    const phone = phoneUtil.parse(number, country.iso2.toUpperCase())
    const isValid = phoneUtil.isValidNumberForRegion(phone, country.iso2.toUpperCase())
    if (isValid) {
      return phoneUtil.format(phone, PhoneNumberFormat.E164)
    }
    return undefined
  } catch (e) {
    return undefined
  }
}
