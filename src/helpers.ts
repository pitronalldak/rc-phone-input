interface IFormattedObject {
  formattedText: string
  remainingText: string[]
}

export function removeCountryCode(country: any, number: string): string {
  return number.replace(/\D/g, '').replace(`${country.dialCode}`, '')
}

export const formatNumber = (text: string, pattern: string): string => {
  if (!text || text.length === 0) {
    return ''
  }

  const formattedObject: IFormattedObject = pattern.split('').reduce(
    (acc, character) => {
      if (acc.remainingText.length === 0) {
        return acc
      }

      if (character !== '.') {
        return {
          formattedText: acc.formattedText + character,
          remainingText: acc.remainingText
        }
      }

      return {
        formattedText: acc.formattedText + acc.remainingText[0],
        remainingText: acc.remainingText.slice(1, acc.remainingText.length)
      }
    },
    { formattedText: '', remainingText: text.split('') }
  )
  return (
    formattedObject.formattedText + formattedObject.remainingText.join('')
  )
}
