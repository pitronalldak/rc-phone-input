import * as chai from 'chai'
import * as dirtyChai from 'dirty-chai'

const { expect } = chai
chai.use(dirtyChai)

import * as React from 'react'
import * as ReactDOM from 'react-dom'
import * as Enzyme from 'enzyme'
import { shallow, mount } from 'enzyme'
import * as Adapter from 'enzyme-adapter-react-16'

import * as TestUtils from 'react-dom/test-utils'
import * as countryData from 'country-telephone-data'
import { RCPhoneInput } from '../src'
import { validateNumber } from '../src/helpers'

Enzyme.configure({ adapter: new Adapter() })

const { allCountries } = countryData
let rti

describe('react telephone input', () => {
  afterEach(() => {
    if (rti) {
      ReactDOM.unmountComponentAtNode(
        ReactDOM.findDOMNode(rti).parentNode
      )
      rti = null
    }
  })

  it('mandatory existential crisis test', () => {
    rti = TestUtils.renderIntoDocument(
      React.createElement(RCPhoneInput, {})
    )
    expect(rti).to.be.defined
    expect(rti.refs.numberInput).to.be.defined
  })

  it('should render the top divs and inputses', () => {
    const wrapper = shallow(<RCPhoneInput />)

    expect(wrapper.find('div.rc-phone-input')).to.have.length(1)
    expect(wrapper.find('input')).to.have.length(1)
  })

  it('should show the placeholder as passed in the prop', () => {
    const placeholder = '0001-121-212'
    const component = mount(
      <RCPhoneInput placeholder={placeholder} />
    )
    const input = component.find('input')
    expect(input.prop('placeholder')).to.eql(placeholder)
  })

  it('should guess correct country when flag is changed manually from the dropdown', () => {
    const wrapper = mount(
      <RCPhoneInput
        defaultCountry="us"
        preferredCountries={['us', 'ca', 'zz', 'hk']}
      />
    )
    expect(wrapper.find('div.flag-dropdown')).to.have.length(1)
    expect(wrapper.find('div.selected-flag > div.us')).to.have.length(1)

    expect(wrapper.find('ul.country-list')).to.have.length(0)
    wrapper.find('div.selected-flag').simulate('click')
    expect(wrapper.find('ul.country-list')).to.have.length(1)

    wrapper.find('ul.country-list > li').at(1).simulate('click')
    expect(wrapper.find('ul.country-list')).to.have.length(0)
    expect(wrapper.find('div.selected-flag > div.ca')).to.have.length(1)
  })

  it('should allow custom value for autoComplete input property', () => {
    const wrapper = shallow(<RCPhoneInput />)
    expect(wrapper.find('input').prop('autoComplete')).to.equal('tel')

    const wrapper2 = shallow(<RCPhoneInput autoComplete="off" />)
    expect(wrapper2.find('input').prop('autoComplete')).to.equal('off')
  })

  it('should guess selected country', () => {
    rti = TestUtils.renderIntoDocument(
      React.createElement(RCPhoneInput, {})
    )
    rti.state.selectedCountry = undefined
    expect(rti.guessSelectedCountry('').iso2).to.equal(allCountries[0].iso2)

    // expect(rti.guessSelectedCountry('12').iso2).to.equal('us')
    // expect(rti.guessSelectedCountry('12112121').iso2).to.equal('us')
    // expect(rti.guessSelectedCountry('913212121').iso2).to.equal('in')
    expect(rti.guessSelectedCountry('237').iso2).to.equal('cm')
    expect(rti.guessSelectedCountry('599').iso2).to.equal('cw')
    expect(rti.guessSelectedCountry('590').iso2).to.equal('gp')
    expect(rti.guessSelectedCountry('1403').iso2).to.equal('ca')
    // expect(rti.guessSelectedCountry('18005').iso2).to.equal('us')
    expect(rti.guessSelectedCountry('1809').iso2).to.equal('do')

    expect(rti.guessSelectedCountry('59').iso2).to.equal(
      allCountries[0].iso2
    )
  })

  it('should set the correct highlightCountryIndex', () => {
    const afghanistan = {
        name: 'Afghanistan (‫افغانستان‬‎)',
        iso2: 'af',
        dialCode: '93',
        priority: 0
    }
    const albania = {
        name: 'Albania (Shqipëri)',
        iso2: 'al',
        dialCode: '355',
        priority: 0
    }
    const algeria = {
        name: 'Algeria (‫الجزائر‬‎)',
        iso2: 'dz',
        dialCode: '213',
        priority: 0
    }

    rti = TestUtils.renderIntoDocument(
        React.createElement(RCPhoneInput, {
            onlyCountries: [afghanistan, albania, algeria],
            preferredCountries: [algeria.iso2],
            initialValue: '+121345'
        })
    )

    const fakeEvent = {
      preventDefault: () => {}
    }

    rti.handleFlagItemClick(algeria)
    rti.handleFlagDropdownClick(fakeEvent)
    expect(rti.state.highlightCountryIndex).to.equal(0)

    rti.handleFlagItemClick(afghanistan)
    rti.handleFlagDropdownClick(fakeEvent)
    expect(rti.state.highlightCountryIndex).to.equal(1)

    rti.handleFlagItemClick(albania)
    rti.handleFlagDropdownClick(fakeEvent)
    expect(rti.state.highlightCountryIndex).to.equal(2)
  })

  it('should trigger onFocus event handler when input element is focused', done => {
    const onFocus = (number, country) => {
        expect(number).to.be.a.string
        expect(country).to.be.string
        done()
    }

    rti = TestUtils.renderIntoDocument(
      React.createElement(RCPhoneInput, { onFocus })
    )
    expect(rti).to.be.defined

    TestUtils.Simulate.focus(rti.numberInputRef)
  })

  it('should trigger onBlur event handler when input element is unfocused', done => {
    const onBlur = (number, country) => {
        expect(number).to.be.a.string
        expect(country).to.be.string
        done()
    }

    rti = TestUtils.renderIntoDocument(
      React.createElement(RCPhoneInput, { onBlur })
    )
    expect(rti).to.be.defined

    TestUtils.Simulate.blur(rti.numberInputRef)
  })

  it('should re-render as empty once value prop becomes null', () => {
    const component = mount(
      <RCPhoneInput value="+12313123132" />
    )
    expect(component.state('formattedNumber')).to.equal('+12313123132')
    component.number = '+12313123132'
    component.setProps({ value: '123' })
    expect(component.state('formattedNumber')).to.be.undefined()
  })

  it('removes prefix from value', () => {
    const component = mount(
      <RCPhoneInput value="+38649112992" />
    )
    expect(component.state('number')).to.equal('49112992')
  })

  describe('validate number', () => {
    it('should format number', () => {
      const country = allCountries.find(country => country.iso2 === 'ru')
      const number = '(915) 287 - 19 - 06'
      const expectedFormattedNumber = '+79152871906'

      expect(validateNumber(country, number)).to.equal(
        expectedFormattedNumber
      )
    })

    it('should return undefined in number invalid', () => {
      const country = allCountries.find(country => country.iso2 === 'ru')
      const number = '888152871906'
      const expectedFormattedNumber = '+79152871906'

      expect(validateNumber(country, number)).to.be.undefined()
    })
  })
})
