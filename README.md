# react-phone-input

[![npm version](https://img.shields.io/npm/v/rc-phone-input.svg?style=flat-square)](https://www.npmjs.com/package/rc-phone-input)
[![npm downloads](https://img.shields.io/npm/dm/rc-phone-input.svg?style=flat-square)](https://www.npmjs.com/package/rc-phone-input)

International phone number `<input/>` in React with Ip-lookup

[See Demo](http://pitronalldak.github.io/rc-phone-input/)

## Screenshots

<img src="https://raw.githubusercontent.com/pitronalldak/rc-phone-input/master/docs/images/Screen-Shot.png" width="279" height="156"/>

## Installation

```
npm install rc-phone-input --save
```

## Usage

```js
import RCPhoneInput from 'rc-phone-input'

return (
	<RCPhoneInput
		value="+79152881980"
		onChange={ value => console.log(value) } />
)
```
