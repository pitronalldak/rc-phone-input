import { validateNumber } from '../src/helpers'

describe('utils', () => {
  describe('validateNumber', () => {
    it('validates polish phone number', () => {
      const iso2 = 'pl'
      const phoneNumber = '+48 503 433 543'
      const validPhoneNumber = '+48503433543'

      expect(validateNumber({ iso2 }, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates swiss phone number', () => {
      const iso2 = 'ch'
      const phoneNumber = '+41 (0) 78 733 93 91'
      const validPhoneNumber = '+41787339391'

      expect(validateNumber({ iso2 }, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('validates german phone number', () => {
      const iso2 = 'de'
      const phoneNumber = '+49 0 30 20649197'
      const validPhoneNumber = '+493020649197'

      expect(validateNumber({ iso2 }, phoneNumber)).toEqual(validPhoneNumber)
    })

    it('returns undefined if phone number is not valid', () => {
      const iso2 = 'pl'
      const phoneNumber = '+48 503'

      expect(validateNumber({ iso2 }, phoneNumber)).toBeUndefined()
    })

    it('returns undefined if country code is wrong number is not valid', () => {
      const iso2 = 'de'
      const phoneNumber = '+48 503 433 543'

      expect(validateNumber({ iso2 }, phoneNumber)).toBeUndefined()
    })

    it('returns undefined if phone number is invalid', () => {
      const iso2 = 'de'
      const phoneNumber = 'phone number'

      expect(validateNumber({ iso2 }, phoneNumber)).toBeUndefined()
    })
  })
})
