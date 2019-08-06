"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var classNames = require("classnames");
var countryData = require("country-telephone-data");
var React = require("react");
var react_onclickoutside_1 = require("react-onclickoutside");
var enums_1 = require("./enums");
var helpers_1 = require("./helpers");
var allCountries = countryData.allCountries, iso2Lookup = countryData.iso2Lookup, allCountryCodes = countryData.allCountryCodes;
var FLAG_WIDTH = 16;
var FLAG_HEIGHT = 11;
var RCPhoneInput = /** @class */ (function (_super) {
    __extends(RCPhoneInput, _super);
    function RCPhoneInput(props) {
        var _this = _super.call(this, props) || this;
        _this.mapPropsToState = function (props) {
            var number = '';
            var formattedNumber;
            var selectedCountryGuess = _this.guessSelectedCountry(number);
            if (props.value) {
                selectedCountryGuess = _this.guessSelectedCountry(props.value);
                if (selectedCountryGuess) {
                    if (props.value.startsWith('+' + selectedCountryGuess.dialCode)) {
                        number = props.value.split(selectedCountryGuess.dialCode)[1];
                    }
                    else {
                        number = props.value;
                    }
                    formattedNumber = props.value;
                }
            }
            else if (_this.props.value) {
                number = '';
            }
            else if (_this.state &&
                _this.state.formattedNumber) {
                number = _this.state.formattedNumber;
            }
            var selectedCountryGuessIndex = allCountries.findIndex(function (item) { return item === selectedCountryGuess; });
            return {
                selectedCountry: selectedCountryGuess,
                highlightCountryIndex: selectedCountryGuessIndex,
                formattedNumber: formattedNumber,
                number: number
            };
        };
        _this.scrollTo = function (country, middle) {
            if (!country) {
                return;
            }
            var container = _this.flagDropdownListRef;
            if (!container) {
                return;
            }
            var containerHeight = container.offsetHeight;
            var containerOffset = container.getBoundingClientRect();
            var containerTop = containerOffset.top + document.body.scrollTop;
            var containerBottom = containerTop + containerHeight;
            var element = country;
            var elementOffset = element.getBoundingClientRect();
            var elementHeight = element.offsetHeight;
            var elementTop = elementOffset.top + document.body.scrollTop;
            var elementBottom = elementTop + elementHeight;
            var newScrollTop = elementTop - containerTop + container.scrollTop;
            var middleOffset = containerHeight / 2 - elementHeight / 2;
            if (elementTop < containerTop) {
                if (middle) {
                    newScrollTop -= middleOffset;
                }
                container.scrollTop = newScrollTop;
            }
            else if (elementBottom > containerBottom) {
                if (middle) {
                    newScrollTop += middleOffset;
                }
                var heightDifference = containerHeight - elementHeight;
                container.scrollTop = newScrollTop - heightDifference;
            }
        };
        _this.guessSelectedCountry = function (inputNumber) {
            var _a = _this.props, defaultCountry = _a.defaultCountry, onlyCountries = _a.onlyCountries;
            if (_this.state && _this.state.selectedCountry) {
                return _this.state.selectedCountry;
            }
            var secondBestGuess = allCountries.find(function (country) {
                return country.iso2 === defaultCountry;
            }) || onlyCountries[0];
            var inputNumberForCountries = inputNumber.substr(0, 4);
            var bestGuess;
            if (inputNumber.trim() !== '') {
                bestGuess = onlyCountries.reduce(function (selCountry, country) {
                    if (allCountryCodes[inputNumberForCountries] &&
                        allCountryCodes[inputNumberForCountries][0] === country.iso2) {
                        return country;
                    }
                    else if (allCountryCodes[inputNumberForCountries] &&
                        allCountryCodes[inputNumberForCountries][0] === selCountry.iso2) {
                        return selCountry;
                    }
                    else {
                        if (inputNumber.startsWith('+' + country.dialCode)) {
                            if (country.dialCode.length >
                                selCountry.dialCode.length) {
                                return country;
                            }
                            if (country.dialCode.length ===
                                selCountry.dialCode.length &&
                                country.priority < selCountry.priority) {
                                return country;
                            }
                        }
                    }
                    return selCountry;
                }, { dialCode: '', priority: 10001, iso2: '' });
            }
            else {
                return secondBestGuess;
            }
            if (!bestGuess.name) {
                return secondBestGuess;
            }
            return bestGuess;
        };
        _this.handleFlagDropdownClick = function (event) {
            var _a = _this.props, disabled = _a.disabled, onlyCountries = _a.onlyCountries;
            var _b = _this.state, isShowDropDown = _b.isShowDropDown, selectedCountry = _b.selectedCountry, preferredCountries = _b.preferredCountries, highlightCountryIndex = _b.highlightCountryIndex;
            if (disabled) {
                return;
            }
            event.preventDefault();
            _this.setState({
                isShowDropDown: !isShowDropDown,
                highlightCountry: onlyCountries.find(function (country) { return country.iso2 === selectedCountry.iso2; }),
                highlightCountryIndex: preferredCountries.concat(onlyCountries)
                    .findIndex(function (country) { return country.iso2 === selectedCountry.iso2; })
            }, function () {
                _this.scrollTo(_this.getElement(highlightCountryIndex + preferredCountries.length), true);
            });
        };
        _this.handleInput = function (event) {
            var onChange = _this.props.onChange;
            var _a = _this.state, selectedCountry = _a.selectedCountry, freezeSelection = _a.freezeSelection, number = _a.number;
            var nextFreezeSelection = freezeSelection;
            var nextNumber = event.target.value;
            if (nextNumber === number) {
                return;
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
            if (nextNumber && !freezeSelection) {
                nextFreezeSelection = false;
            }
            var formattedNumber = helpers_1.validateNumber(selectedCountry, nextNumber);
            _this.setState({
                formattedNumber: formattedNumber,
                number: nextNumber,
                freezeSelection: nextFreezeSelection
            });
            _this.handleChange({ country: selectedCountry, number: nextNumber, formattedNumber: formattedNumber });
        };
        _this.handleInputClick = function () {
            _this.setState({ isShowDropDown: false });
        };
        _this.handleFlagItemClick = function (country, event) {
            var _a = _this.props, onlyCountries = _a.onlyCountries, onChange = _a.onChange;
            var _b = _this.state, selectedCountry = _b.selectedCountry, number = _b.number;
            var nextSelectedCountry = onlyCountries.find(function (item) { return item.iso2 === country.iso2; });
            if (nextSelectedCountry && selectedCountry.iso2 !== nextSelectedCountry.iso2) {
                var formattedNumber = helpers_1.validateNumber(nextSelectedCountry, number);
                _this.setState({
                    isShowDropDown: false,
                    formattedNumber: formattedNumber,
                    selectedCountry: nextSelectedCountry,
                    freezeSelection: true
                }, function () {
                    if (_this.numberInputRef) {
                        _this.numberInputRef.focus();
                    }
                });
                _this.handleChange({ country: selectedCountry, formattedNumber: formattedNumber });
            }
            else {
                _this.setState({ isShowDropDown: false });
            }
        };
        _this.handleInputFocus = function () {
            var onFocus = _this.props.onFocus;
            var _a = _this.state, formattedNumber = _a.formattedNumber, number = _a.number, selectedCountry = _a.selectedCountry;
            if (typeof onFocus === 'function') {
                onFocus({ number: number, formattedNumber: formattedNumber, country: selectedCountry });
            }
        };
        _this.getHighlightCountryIndex = function (direction) {
            var _a = _this.state, highlightCountryIndex = _a.highlightCountryIndex, preferredCountries = _a.preferredCountries;
            var onlyCountries = _this.props.onlyCountries;
            var nextIndex = highlightCountryIndex + direction;
            if (nextIndex < 0 || nextIndex >= onlyCountries.length + preferredCountries.length) {
                return nextIndex - direction;
            }
            return nextIndex;
        };
        _this.searchCountry = function () {
            var onlyCountries = _this.props.onlyCountries;
            var _a = _this.state, queryString = _a.queryString, preferredCountries = _a.preferredCountries;
            var probableCountries = onlyCountries.filter(function (country) {
                return country.name.toLowerCase().startsWith(queryString.toLowerCase());
            });
            var probableCandidate = probableCountries[0] || onlyCountries[0];
            var probableCandidateIndex = onlyCountries.findIndex(function (item) { return item === probableCandidate; }) + preferredCountries.length;
            _this.scrollTo(_this.getElement(probableCandidateIndex), true);
            _this.setState({
                queryString: '',
                highlightCountryIndex: probableCandidateIndex
            });
        };
        _this.handleKeydown = function (event) {
            var _a = _this.state, isShowDropDown = _a.isShowDropDown, highlightCountryIndex = _a.highlightCountryIndex, preferredCountries = _a.preferredCountries, queryString = _a.queryString, debouncedQueryStingSearcher = _a.debouncedQueryStingSearcher;
            var onlyCountries = _this.props.onlyCountries;
            if (!isShowDropDown) {
                return;
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
            var moveHighlight = function (direction) {
                _this.setState({
                    highlightCountryIndex: _this.getHighlightCountryIndex(direction)
                }, function () { _this.scrollTo(_this.getElement(highlightCountryIndex), true); });
            };
            switch (event.which) {
                case enums_1.Keys.DOWN:
                    moveHighlight(1);
                    break;
                case enums_1.Keys.UP:
                    moveHighlight(-1);
                    break;
                case enums_1.Keys.ENTER:
                    _this.handleFlagItemClick(preferredCountries.concat(onlyCountries)[highlightCountryIndex], event);
                    break;
                case enums_1.Keys.ESC:
                    _this.setState({ isShowDropDown: false });
                    break;
                default:
                    if ((event.which >= enums_1.Keys.A && event.which <= enums_1.Keys.Z) || event.which === enums_1.Keys.SPACE) {
                        _this.setState({
                            queryString: queryString + String.fromCharCode(event.which)
                        }, debouncedQueryStingSearcher);
                    }
            }
        };
        _this.handleInputKeyDown = function (event) {
            var onEnterKeyPress = _this.props.onEnterKeyPress;
            if (typeof onEnterKeyPress === 'function' && event.which === enums_1.Keys.ENTER) {
                onEnterKeyPress(event);
            }
        };
        _this.handleClickOutside = function () {
            var isShowDropDown = _this.state.isShowDropDown;
            if (isShowDropDown) {
                _this.setState({ isShowDropDown: false });
            }
        };
        _this.getNumberFormat = function (country) {
            if (!country.format) {
                return '';
            }
            var nextPlaceholder = country.format.split('');
            var count = 0;
            for (var index = 0; index < nextPlaceholder.length; index++) {
                if (nextPlaceholder[index] === '+') {
                    nextPlaceholder[index] = '';
                }
                if (nextPlaceholder[index] === '(' || nextPlaceholder[index] === ')') {
                    nextPlaceholder[index] = '';
                }
                if (nextPlaceholder[index] === '\.') {
                    count++;
                    nextPlaceholder[index] = '';
                }
                if (count >= country.dialCode.length) {
                    break;
                }
            }
            nextPlaceholder = nextPlaceholder.join('').trim().split('');
            if (nextPlaceholder[0] === '-' || nextPlaceholder[0] === ')') {
                nextPlaceholder.shift();
            }
            return nextPlaceholder.join('').trim();
        };
        _this.getCountryDropDownList = function () {
            var _a = _this.props, flagsImagePath = _a.flagsImagePath, onlyCountries = _a.onlyCountries;
            var _b = _this.state, preferredCountries = _b.preferredCountries, highlightCountryIndex = _b.highlightCountryIndex;
            var countryDropDownList = preferredCountries.concat(onlyCountries)
                .map(function (country, index) {
                var itemClasses = classNames({
                    country: true,
                    preferred: preferredCountries.some(function (item) { return item.iso2 === country.iso2; }),
                    highlight: highlightCountryIndex === index
                });
                var inputFlagClasses = "flag " + country.iso2;
                var inputFlagStyles = {
                    width: FLAG_WIDTH,
                    height: FLAG_HEIGHT,
                    backgroundImage: "url(" + flagsImagePath + ")"
                };
                return (React.createElement("li", { ref: function (el) { _this["flag_no_" + index] = el; }, key: "flag_no_" + index, "data-flag-key": "flag_no_" + index, className: itemClasses, "data-dial-code": "1", "data-country-code": country.iso2, onClick: function () { return _this.handleFlagItemClick(country); } },
                    React.createElement("div", { className: inputFlagClasses, style: inputFlagStyles }),
                    React.createElement("span", { className: "country-name" }, country.name),
                    React.createElement("span", { className: "dial-code" }, '+' + country.dialCode)));
            });
            var dashedLi = React.createElement("li", { key: 'dashes', className: "divider" });
            if (preferredCountries.length) {
                countryDropDownList.splice(preferredCountries.length, 0, dashedLi);
            }
            var dropDownClasses = classNames({
                'country-list': true,
                'hide': !_this.state.isShowDropDown
            });
            return (React.createElement("ul", { ref: function (el) { _this.flagDropdownListRef = el; }, className: dropDownClasses }, countryDropDownList));
        };
        _this.handleInputBlur = function () {
            var onBlur = _this.props.onBlur;
            var _a = _this.state, number = _a.number, formattedNumber = _a.formattedNumber, selectedCountry = _a.selectedCountry;
            if (typeof onBlur === 'function') {
                onBlur({ number: number, formattedNumber: formattedNumber, country: selectedCountry });
            }
        };
        _this.handleChange = function (args) {
            var _a = _this.props, onlyCountries = _a.onlyCountries, onChange = _a.onChange;
            var _b = _this.state, selectedCountry = _b.selectedCountry, number = _b.number, formattedNumber = _b.formattedNumber;
            if (typeof onChange === 'function') {
                onChange(__assign({ country: selectedCountry, number: number, formattedNumber: formattedNumber }, args));
            }
        };
        var preferredCountries = _this.props.preferredCountries;
        var nextPreferredCountries = preferredCountries.filter(function (iso2) { return iso2Lookup.hasOwnProperty(iso2); })
            .map(function (iso2) { return iso2Lookup.hasOwnProperty(iso2) ? allCountries[iso2Lookup[iso2]] : null; });
        _this.state = __assign({ preferredCountries: nextPreferredCountries, isShowDropDown: false, queryString: '', number: '', freezeSelection: false, debouncedQueryStingSearcher: function () { return window.setTimeout(_this.searchCountry, 300); } }, _this.mapPropsToState(_this.props));
        return _this;
    }
    RCPhoneInput.prototype.componentDidMount = function () {
        var _a = this.props, onlyCountries = _a.onlyCountries, countryCode = _a.countryCode, onChange = _a.onChange, value = _a.value;
        if (!value && countryCode) {
            var selectedCountry_1 = onlyCountries.find(function (country) { return country.iso2 === countryCode.toLowerCase(); });
            var highlightCountryIndex = allCountries.findIndex(function (item) { return item === selectedCountry_1; });
            if (selectedCountry_1 && highlightCountryIndex) {
                if (typeof onChange === 'function') {
                    onChange({ country: selectedCountry_1, number: '' });
                }
                this.setState({
                    selectedCountry: selectedCountry_1,
                    highlightCountryIndex: highlightCountryIndex
                });
            }
        }
        document.addEventListener('keydown', this.handleKeydown);
    };
    RCPhoneInput.prototype.componentDidUpdate = function (prevProps, prevState) {
        var value = this.props.value;
        if (prevProps.value !== value && this.state.formattedNumber !== value) {
            var formattedNumber = helpers_1.validateNumber(this.state.selectedCountry, value);
            this.setState({
                number: value,
                formattedNumber: formattedNumber
            });
        }
    };
    RCPhoneInput.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    RCPhoneInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, isValid = _a.isValid, inputProps = _a.inputProps, inputId = _a.inputId, className = _a.className, autoComplete = _a.autoComplete, required = _a.required, disabled = _a.disabled, flagsImagePath = _a.flagsImagePath, placeholder = _a.placeholder;
        var _b = this.state, number = _b.number, isShowDropDown = _b.isShowDropDown, selectedCountry = _b.selectedCountry;
        var arrowClasses = classNames({
            arrow: true,
            up: isShowDropDown
        });
        var inputClasses = classNames({
            'form-control': true,
            'invalid-number': typeof isValid === 'function' && !isValid(number)
        });
        var flagViewClasses = classNames({
            'flag-dropdown': true,
            'open-dropdown': isShowDropDown
        });
        var inputFlagClasses = "flag " + selectedCountry.iso2;
        var inputFlagStyles = {
            width: FLAG_WIDTH,
            height: FLAG_HEIGHT,
            backgroundImage: "url(" + flagsImagePath + ")"
        };
        var otherProps = inputProps;
        if (inputId) {
            otherProps.id = inputId;
        }
        return (React.createElement("div", { className: classNames('rc-phone-input', className) },
            React.createElement("input", __assign({ onChange: this.handleInput, onClick: this.handleInputClick, onFocus: this.handleInputFocus, onBlur: this.handleInputBlur, onKeyDown: this.handleInputKeyDown, value: number, ref: function (el) { _this.numberInputRef = el; }, type: "tel", className: inputClasses, autoComplete: autoComplete, required: required, placeholder: placeholder, disabled: disabled }, otherProps)),
            React.createElement("div", { ref: function (el) { _this.flagDropDownButtonRef = el; }, className: flagViewClasses, onKeyDown: this.handleKeydown },
                React.createElement("div", { ref: function (el) { _this.selectedFlagRef = el; }, onClick: this.handleFlagDropdownClick, className: "selected-flag", title: selectedCountry.name + ": + " + selectedCountry.dialCode },
                    React.createElement("div", { className: inputFlagClasses, style: inputFlagStyles },
                        React.createElement("div", { className: arrowClasses }))),
                isShowDropDown ? this.getCountryDropDownList() : '')));
    };
    RCPhoneInput.prototype.getElement = function (index) {
        return this["flag_no_" + index];
    };
    RCPhoneInput.defaultProps = {
        preferredCountries: [],
        onlyCountries: allCountries,
        defaultCountry: allCountries[0].iso2,
        flagsImagePath: './images/flags.png',
        disabled: false,
        autoComplete: 'tel',
        required: false,
        inputProps: {}
    };
    return RCPhoneInput;
}(React.Component));
exports.RCPhoneInput = RCPhoneInput;
exports.default = react_onclickoutside_1.default(RCPhoneInput);
//# sourceMappingURL=index.js.map