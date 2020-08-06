import { validateNumber } from '../src/helpers'

describe('utils', () => {
  const countryPl = { iso2: 'pl', dialCode: '48' }
  const countryCh = { iso2: 'ch', dialCode: '41' }
  const countryDe = { iso2: 'de', dialCode: '49' }

  describe('validateNumber', () => {
    it('validates polish phone number', () => {
      const phoneNumber = '+48 503 433 543'
      const validPhoneNumber = '+48503433543'

      expect(validateNumber(countryPl, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates polish phone number without area code', () => {
      const phoneNumber = '503 433 543'
      const validPhoneNumber = '+48503433543'

      expect(validateNumber(countryPl, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates swiss phone number', () => {
      const phoneNumber = '+41 78 733 93 91'
      const validPhoneNumber = '+41787339391'

      expect(validateNumber(countryCh, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates swiss phone number without area code', () => {
      const phoneNumber = '78 733 93 91'
      const validPhoneNumber = '+41787339391'

      expect(validateNumber(countryCh, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates german phone number', () => {
      const phoneNumber = '+49 30 20649197'
      const validPhoneNumber = '+493020649197'

      expect(validateNumber(countryDe, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates german phone number without area code', () => {
      const phoneNumber = '30 20649197'
      const validPhoneNumber = '+493020649197'

      expect(validateNumber(countryDe, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('returns undefined if phone number is not valid', () => {
      const phoneNumber = '+48 503'

      expect(validateNumber(countryPl, phoneNumber)).toBeUndefined()
    })

    it('returns undefined if phone number is invalid', () => {
      const phoneNumber = 'phone number'

      expect(validateNumber(countryDe, phoneNumber)).toBeUndefined()
    })
  })
})
