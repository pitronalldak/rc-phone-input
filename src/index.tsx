import * as classNames from 'classnames'
import * as countryData from 'country-telephone-data'
import * as fetchJsonp from 'fetch-jsonp'
import { isEqual } from 'lodash'
import * as React from 'react'
import onClickOutside from 'react-onclickoutside'

import { Keys } from './enums'
import { formatNumber, removeCountryCode } from './helpers'

const { allCountries, iso2Lookup, allCountryCodes }  = countryData

const FLAG_WIDTH: number = 16
const FLAG_HEIGHT: number = 11

interface ICountry {
  name: string
  iso2: string
  format: string
  dialCode: string
  priority: number
}

interface IProps {
  value?: string
  initialValue?: string
  defaultCountry?: string
  isValid?: (number: string) => void
  onlyCountries: ICountry[]
  preferredCountries: string[]
  className?: string
  inputId?: string
  onChange?: (event: any) => void
  onEnterKeyPress?: (event: any) => void
  onBlur?: (event: any) => void
  onFocus?: (event: any) => void
  disabled: boolean
  required: boolean
  inputProps: {id?: string}
  flagsImagePath?: string
  autoComplete?: string
  placeholder?: string
  withIpLookup?: boolean
}

interface IState {
  preferredCountries: ICountry[]
  selectedCountry: ICountry
  highlightCountry?: ICountry
  highlightCountryIndex: number
  formattedNumber: string
  isShowDropDown: boolean
  freezeSelection: boolean
  queryString: string
  debouncedQueryStingSearcher: () => number
}

interface IPartialState {
  selectedCountry: ICountry
  highlightCountryIndex: number
  formattedNumber: string
}

export class RCPhoneInput extends React.Component<IProps, IState> {
  private static defaultProps: IProps = {
    preferredCountries: [],
    onlyCountries: allCountries,
    defaultCountry: allCountries[0].iso2,
    flagsImagePath: './images/flags.png',
    disabled: false,
    autoComplete: 'tel',
    required: false,
    inputProps: {}
  }
  private numberInputRef: HTMLInputElement | null
  private flagDropDownButtonRef: HTMLDivElement | null
  private selectedFlagRef: HTMLDivElement | null
  private flagDropdownListRef: HTMLUListElement | null

  constructor(props) {
    super(props)
    const { preferredCountries } = this.props

    const nextPreferredCountries = preferredCountries.filter(iso2 => iso2Lookup.hasOwnProperty(iso2))
      .map(iso2 => iso2Lookup.hasOwnProperty(iso2) ? allCountries[iso2Lookup[iso2]] : null)

    this.state = {
      preferredCountries: nextPreferredCountries,
      isShowDropDown: false,
      queryString: '',
      freezeSelection: false,
      debouncedQueryStingSearcher: () => window.setTimeout(this.searchCountry, 300),
      ...this.mapPropsToState(this.props)
    }
  }

  public componentDidMount(): void {
    const { onlyCountries, withIpLookup, onChange } = this.props

    if (withIpLookup) {
      fetchJsonp('https://ipinfo.io')
      .then(response => response.json())
      .then(json => {
        const selectedCountry = onlyCountries.find(country => country.iso2 === json.country.toLowerCase())
        const highlightCountryIndex = allCountries.findIndex(item => item === selectedCountry)

        if (selectedCountry && highlightCountryIndex) {
          if (typeof onChange === 'function') {
            onChange({country: selectedCountry, number: ''})
          }

          this.setState({
            selectedCountry,
            highlightCountryIndex
          })
        }
      })
    }

    document.addEventListener('keydown', this.handleKeydown)
  }

  public componentWillReceiveProps(nextProps: IProps): void {
    this.setState(this.mapPropsToState(nextProps))
  }

  public componentWillUnmount(): void {
    document.removeEventListener('keydown', this.handleKeydown)
  }

  public shouldComponentUpdate(nextProps: IProps, nextState): boolean {
    return !isEqual(nextProps, this.props) || !isEqual(nextState, this.state)
  }

  public render(): JSX.Element {
    const {
      isValid, inputProps, inputId,
      className, autoComplete, required,
      disabled, flagsImagePath
    } = this.props
    const { formattedNumber, isShowDropDown, selectedCountry } = this.state

    const arrowClasses: string = classNames({
      arrow: true,
      up: isShowDropDown
    })

    const inputClasses: string = classNames({
      'form-control': true,
      'invalid-number': typeof isValid === 'function' && !isValid(formattedNumber.replace(/\D/g, ''))
    })

    const flagViewClasses: string = classNames({
        'flag-dropdown': true,
        'open-dropdown': isShowDropDown
    })

    const inputFlagClasses: string = `flag ${selectedCountry.iso2}`
    const inputFlagStyles = {
      width: FLAG_WIDTH,
      height: FLAG_HEIGHT,
      backgroundImage: `url(${flagsImagePath})`
    }

    const otherProps = inputProps
    if (inputId) {
      otherProps.id = inputId
    }

    return (
      <div
        className={classNames(
          'rc-phone-input',
          className
        )}
      >
        <input
          onChange={this.handleInput}
          onClick={this.handleInputClick}
          onFocus={this.handleInputFocus}
          onBlur={this.handleInputBlur}
          onKeyDown={this.handleInputKeyDown}
          value={formattedNumber}
          ref={el => {this.numberInputRef = el}}
          type="tel"
          className={inputClasses}
          autoComplete={autoComplete}
          required={required}
          placeholder={this.getCountryPlaceholder(selectedCountry)}
          disabled={disabled}
          {...otherProps}
        />
        <div
          ref={el => {this.flagDropDownButtonRef = el}}
          className={flagViewClasses}
          onKeyDown={this.handleKeydown}
        >
          <div
            ref={el => {this.selectedFlagRef = el}}
            onClick={this.handleFlagDropdownClick}
            className="selected-flag"
            title={`${selectedCountry.name}: + ${selectedCountry.dialCode}`}
          >
            <div
              className={inputFlagClasses}
              style={inputFlagStyles}
            >
              <div className={arrowClasses} />
            </div>
          </div>
          {isShowDropDown ? this.getCountryDropDownList() : ''}
        </div>
      </div>
    )}

  private mapPropsToState = (props, firstCall?): IPartialState => {
    let inputNumber: string = ''
    let selectedCountryGuess: ICountry = this.guessSelectedCountry(inputNumber.replace(/\D/g, ''))

    if (props.value) {
      selectedCountryGuess = this.guessSelectedCountry(props.value.replace(/\D/g, ''))
      if (selectedCountryGuess) {
        inputNumber = removeCountryCode(selectedCountryGuess, props.value)
      }
    } else if (props.initialValue && firstCall) {
      selectedCountryGuess = this.guessSelectedCountry(props.initialValue.replace(/\D/g, ''))
      if (selectedCountryGuess) {
        inputNumber = removeCountryCode(selectedCountryGuess, props.initialValue)
      }
    } else if (this.props.value) {
        inputNumber = ''
    } else if (
      this.state &&
      this.state.formattedNumber &&
      this.state.formattedNumber.length > 0
    ) {
      inputNumber = this.state.formattedNumber
    }

    const selectedCountryGuessIndex = allCountries.findIndex(item => item === selectedCountryGuess)

    const formattedNumber = formatNumber(
      inputNumber.replace(/\D/g, ''),
      this.getNumberFormat(selectedCountryGuess)
    )

    return {
      selectedCountry: selectedCountryGuess,
      highlightCountryIndex: selectedCountryGuessIndex,
      formattedNumber
    }
  }

  private scrollTo = (country: any, middle?: boolean): void => {
    if (!country) {
      return
    }

    const container = this.flagDropdownListRef
    if (!container) {
      return
    }

    const containerHeight = container.offsetHeight
    const containerOffset = container.getBoundingClientRect()
    const containerTop = containerOffset.top + document.body.scrollTop
    const containerBottom = containerTop + containerHeight

    const element = country
    const elementOffset = element.getBoundingClientRect()

    const elementHeight = element.offsetHeight
    const elementTop = elementOffset.top + document.body.scrollTop
    const elementBottom = elementTop + elementHeight
    let newScrollTop = elementTop - containerTop + container.scrollTop
    const middleOffset = containerHeight / 2 - elementHeight / 2

    if (elementTop < containerTop) {
      if (middle) {
        newScrollTop -= middleOffset
      }
      container.scrollTop = newScrollTop
    } else if (elementBottom > containerBottom) {
      if (middle) {
        newScrollTop += middleOffset
      }
      const heightDifference = containerHeight - elementHeight
      container.scrollTop = newScrollTop - heightDifference
    }
  }

  private guessSelectedCountry = (inputNumber: string): ICountry => {
    const { defaultCountry, onlyCountries } = this.props

    if (this.state && this.state.selectedCountry) {
      return this.state.selectedCountry
    }

    const secondBestGuess = allCountries.find(country =>
      country.iso2 === defaultCountry) || onlyCountries[0]

    const inputNumberForCountries = inputNumber.substr(0, 4)

    let bestGuess
    if (inputNumber.trim() !== '') {
      bestGuess = onlyCountries.reduce(
        (selCountry, country) => {
          if (
            allCountryCodes[inputNumberForCountries] &&
            allCountryCodes[inputNumberForCountries][0] === country.iso2
          ) {
            return country
          } else if (
            allCountryCodes[inputNumberForCountries] &&
            allCountryCodes[inputNumberForCountries][0] === selCountry.iso2
          ) {
            return selCountry
          } else {
            if (inputNumber.startsWith(country.dialCode)) {
              if (
                country.dialCode.length >
                selCountry.dialCode.length
              ) {
                return country
              }
              if (
                country.dialCode.length ===
                selCountry.dialCode.length &&
                country.priority < selCountry.priority
              ) {
                return country
              }
            }
          }
          return selCountry
        },
        { dialCode: '', priority: 10001, iso2: '' }
    )} else {
      return secondBestGuess
    }

    if (!bestGuess.name) {
      return secondBestGuess
    }

    return bestGuess
  }

  private getElement(index: number): any {
    return this[`flag_no_${index}`]
  }

  private getFullNumber(formattedNumber: string, selectedCountry: ICountry): string {
    return formatNumber(selectedCountry.dialCode + formattedNumber.replace(/\D/g, ''), selectedCountry.format)
  }

  private handleFlagDropdownClick = (event: any): void => {
    const { disabled, onlyCountries } = this.props
    const {
      isShowDropDown, selectedCountry, preferredCountries,
      highlightCountryIndex
    } = this.state

    if (disabled) {
      return
    }
    event.preventDefault()

    this.setState({
      isShowDropDown: !isShowDropDown,
      highlightCountry: onlyCountries.find(country => country.iso2 === selectedCountry.iso2),
      highlightCountryIndex: preferredCountries.concat(onlyCountries)
        .findIndex(country => country.iso2 === selectedCountry.iso2)
    },
    () => {
      this.scrollTo(this.getElement(highlightCountryIndex + preferredCountries.length), true)
    })
  }

  private handleInput = (event: any): void => {
    const { onChange } = this.props
    const { selectedCountry, freezeSelection, formattedNumber } = this.state
    let nextFreezeSelection = freezeSelection

    if (event.target.value === formattedNumber) {
      return
    }

    if (event.preventDefault) {
      event.preventDefault()
    } else {
      event.returnValue = false
    }

    const inputNumber = event.target.value.replace(/\D/g, '')

    if (inputNumber && !freezeSelection) {
      nextFreezeSelection = false
    }

    const nextFormattedNumber = formatNumber(
      inputNumber,
      this.getNumberFormat(selectedCountry)
    )

    let caretPosition = event.target.selectionStart
    const diff = nextFormattedNumber.length - formattedNumber.length

    this.setState({
        formattedNumber: nextFormattedNumber,
        freezeSelection: nextFreezeSelection
      },
      () => {
        if (caretPosition === 1 && formattedNumber.length === 2) {
          caretPosition++
        }

        if (diff > 0) {
          caretPosition = caretPosition - diff
        }

        if (
          caretPosition > 0 &&
          formattedNumber.length >= nextFormattedNumber.length
        ) {
          if (this.numberInputRef) {
            this.numberInputRef.setSelectionRange(
              caretPosition,
              caretPosition
            )
          }
        }
      }
    )

    if (typeof onChange === 'function') {
      onChange({country: selectedCountry, number: nextFormattedNumber})
    }
  }

  private handleInputClick = (): void => {
    this.setState({ isShowDropDown: false })
  }

  private handleFlagItemClick = (country: ICountry, event?: MouseEvent): any => {
    const { onlyCountries, onChange } = this.props
    const { selectedCountry, formattedNumber } = this.state
    const nextSelectedCountry = onlyCountries.find(item => item.iso2 === country.iso2)

    if (nextSelectedCountry && selectedCountry.iso2 !== nextSelectedCountry.iso2) {
      const nextFormattedNumber = formatNumber(
        formattedNumber.replace(/\D/g, ''),
        this.getNumberFormat(nextSelectedCountry)
      )

      this.setState({
          formattedNumber: nextFormattedNumber,
          isShowDropDown: false,
          selectedCountry: nextSelectedCountry,
          freezeSelection: true
        },
        () => {
          if (this.numberInputRef) {
            this.numberInputRef.focus()
          }
        }
      )

      if (typeof onChange === 'function') {
        onChange({ country: nextSelectedCountry, number: nextFormattedNumber })
      }
    } else {
      this.setState({ isShowDropDown: false })
    }
  }

  private handleInputFocus = (): void => {
    const { onFocus } = this.props
    const { formattedNumber, selectedCountry} = this.state

    if (typeof onFocus === 'function') {
      onFocus({number: formattedNumber, country: selectedCountry})
    }

    this.fillDialCode()
  }

  private fillDialCode(): void {
    const { selectedCountry } = this.state

    if (this.numberInputRef && this.numberInputRef.value === '+') {
      this.setState({formattedNumber: '+' + selectedCountry.dialCode})
    }
  }

  private getHighlightCountryIndex = (direction: number): number => {
    const { highlightCountryIndex, preferredCountries } = this.state
    const { onlyCountries } = this.props

    const nextIndex = highlightCountryIndex + direction

    if (nextIndex < 0 || nextIndex >= onlyCountries.length + preferredCountries.length) {
        return nextIndex - direction
    }

    return nextIndex
  }

  private searchCountry = (): void => {
    const { onlyCountries } = this.props
    const { queryString, preferredCountries } = this.state

    const probableCountries = onlyCountries.filter(country =>
      country.name.toLowerCase().startsWith(queryString.toLowerCase()))

    const probableCandidate = probableCountries[0] || onlyCountries[0]
    const probableCandidateIndex = onlyCountries.findIndex(item => item === probableCandidate) + preferredCountries.length

    this.scrollTo(this.getElement(probableCandidateIndex), true)

    this.setState({
        queryString: '',
        highlightCountryIndex: probableCandidateIndex
    })
  }

  private handleKeydown = (event: any): void => {
    const {
      isShowDropDown, highlightCountryIndex,
      preferredCountries, queryString, debouncedQueryStingSearcher
    } = this.state
    const { onlyCountries } = this.props

    if (!isShowDropDown) {
      return
    }

    if (event.preventDefault) {
        event.preventDefault()
    } else {
        event.returnValue = false
    }

    const moveHighlight = (direction: number): void => {
      this.setState({
          highlightCountryIndex: this.getHighlightCountryIndex(direction)
        },
        () => {this.scrollTo(this.getElement(highlightCountryIndex), true)}
      )
    }

    switch (event.which) {
      case Keys.DOWN:
        moveHighlight(1)
        break
      case Keys.UP:
        moveHighlight(-1)
        break
      case Keys.ENTER:
        this.handleFlagItemClick(
          preferredCountries.concat(onlyCountries)[highlightCountryIndex],
          event
        )
        break
      case Keys.ESC:
        this.setState({ isShowDropDown: false })
        break
      default:
        if ((event.which >= Keys.A && event.which <= Keys.Z) || event.which === Keys.SPACE) {
          this.setState({
            queryString: queryString + String.fromCharCode(event.which)
          }, debouncedQueryStingSearcher)
        }
    }
  }

  private handleInputKeyDown = (event: any): void => {
    const { onEnterKeyPress } = this.props

    if (typeof onEnterKeyPress === 'function' && event.which === Keys.ENTER) {
      onEnterKeyPress(event)
    }
  }

  private handleClickOutside = (): void => {
    const { isShowDropDown } = this.state

    if (isShowDropDown) {
      this.setState({ isShowDropDown: false })
    }
  }

  private getNumberFormat = (country: ICountry): string => {
    if (!country.format) {
      return ''
    }

    let nextPlaceholder = country.format.split('')
    let count = 0

    for (let index = 0; index < nextPlaceholder.length; index++) {
      if (nextPlaceholder[index] === '+') {
        nextPlaceholder[index] = ''
      }

      if (nextPlaceholder[index] === '(' || nextPlaceholder[index] === ')') {
        nextPlaceholder[index] = ''
      }

      if (nextPlaceholder[index] === '\.') {
        count++
        nextPlaceholder[index] = ''
      }

      if (count >= country.dialCode.length) {
        break
      }
    }
    nextPlaceholder = nextPlaceholder.join('').trim().split('')

    if (nextPlaceholder[0] === '-' || nextPlaceholder[0] === ')') {
      nextPlaceholder.shift()
    }

    return nextPlaceholder.join('').trim()
  }

  private getCountryPlaceholder = (country: ICountry): string => {
    const { placeholder } = this.props

    if (placeholder) {
      return placeholder
    }
    const format = this.getNumberFormat(country)
    let nextPlaceholder = ''
    let count = 1
    for (let i = 0; i < format.length; i++) {
      if (format[i] === '.') {
        nextPlaceholder += count.toString()
        count ++
      } else {
        nextPlaceholder += format[i]
      }
    }
    return 'e.g: ' + nextPlaceholder
  }

  private getCountryDropDownList = (): JSX.Element => {
    const { flagsImagePath, onlyCountries } = this.props
    const { preferredCountries, highlightCountryIndex } = this.state

    const countryDropDownList: JSX.Element[] = preferredCountries.concat(onlyCountries)
    .map((country, index) => {
      const itemClasses = classNames({
        country: true,
        preferred: preferredCountries.some(item => item.iso2 === country.iso2),
        highlight: highlightCountryIndex === index
      })

      const inputFlagClasses = `flag ${country.iso2}`
      const inputFlagStyles = {
        width: FLAG_WIDTH,
        height: FLAG_HEIGHT,
        backgroundImage: `url(${flagsImagePath})`
      }

      return (
        <li
          ref={el => {this[`flag_no_${index}`] = el}}
          key={`flag_no_${index}`}
          data-flag-key={`flag_no_${index}`}
          className={itemClasses}
          data-dial-code="1"
          data-country-code={country.iso2}
          onClick={() => this.handleFlagItemClick(country)}
        >
          <div
            className={inputFlagClasses}
            style={inputFlagStyles}
          />
          <span className="country-name">
            {country.name}
          </span>
          <span className="dial-code">
            {'+' + country.dialCode}
          </span>
        </li>
      )
    })

    const dashedLi: JSX.Element = <li key={'dashes'} className="divider" />
    if (preferredCountries.length) {
      countryDropDownList.splice(preferredCountries.length, 0, dashedLi)
    }

    const dropDownClasses: string = classNames({
      'country-list': true,
      'hide': !this.state.isShowDropDown
    })

    return (
      <ul ref={el => {this.flagDropdownListRef = el}} className={dropDownClasses}>
        {countryDropDownList}
      </ul>
    )
  }

  private handleInputBlur = (): void => {
    const { onBlur } = this.props
    const { formattedNumber, selectedCountry } = this.state
    if (typeof onBlur === 'function') {
      onBlur({ number: formattedNumber, country: selectedCountry })
    }
  }
}

export default onClickOutside(RCPhoneInput)
