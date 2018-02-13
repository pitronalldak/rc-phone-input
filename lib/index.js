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
var fetchJsonp = require("fetch-jsonp");
var lodash_1 = require("lodash");
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
        _this.mapPropsToState = function (props, firstCall) {
            var inputNumber = '';
            var selectedCountryGuess = _this.guessSelectedCountry(inputNumber.replace(/\D/g, ''));
            if (props.value) {
                selectedCountryGuess = _this.guessSelectedCountry(props.value.replace(/\D/g, ''));
                if (selectedCountryGuess) {
                    inputNumber = helpers_1.removeCountryCode(selectedCountryGuess, props.value);
                }
            }
            else if (props.initialValue && firstCall) {
                selectedCountryGuess = _this.guessSelectedCountry(props.initialValue.replace(/\D/g, ''));
                if (selectedCountryGuess) {
                    inputNumber = helpers_1.removeCountryCode(selectedCountryGuess, props.initialValue);
                }
            }
            else if (_this.props.value) {
                inputNumber = '';
            }
            else if (_this.state &&
                _this.state.formattedNumber &&
                _this.state.formattedNumber.length > 0) {
                inputNumber = _this.state.formattedNumber;
            }
            var selectedCountryGuessIndex = allCountries.findIndex(function (item) { return item === selectedCountryGuess; });
            var formattedNumber = helpers_1.formatNumber(inputNumber.replace(/\D/g, ''), _this.getNumberFormat(selectedCountryGuess));
            return {
                selectedCountry: selectedCountryGuess,
                highlightCountryIndex: selectedCountryGuessIndex,
                formattedNumber: formattedNumber
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
                        if (inputNumber.startsWith(country.dialCode)) {
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
            var _a = _this.state, selectedCountry = _a.selectedCountry, freezeSelection = _a.freezeSelection, formattedNumber = _a.formattedNumber;
            var nextFreezeSelection = freezeSelection;
            if (event.target.value === formattedNumber) {
                return;
            }
            if (event.preventDefault) {
                event.preventDefault();
            }
            else {
                event.returnValue = false;
            }
            var inputNumber = event.target.value.replace(/\D/g, '');
            if (inputNumber && !freezeSelection) {
                nextFreezeSelection = false;
            }
            var nextFormattedNumber = helpers_1.formatNumber(inputNumber, _this.getNumberFormat(selectedCountry));
            var caretPosition = event.target.selectionStart;
            var diff = nextFormattedNumber.length - formattedNumber.length;
            _this.setState({
                formattedNumber: nextFormattedNumber,
                freezeSelection: nextFreezeSelection
            }, function () {
                if (caretPosition === 1 && formattedNumber.length === 2) {
                    caretPosition++;
                }
                if (diff > 0) {
                    caretPosition = caretPosition - diff;
                }
                if (caretPosition > 0 &&
                    formattedNumber.length >= nextFormattedNumber.length) {
                    if (_this.numberInputRef) {
                        _this.numberInputRef.setSelectionRange(caretPosition, caretPosition);
                    }
                }
            });
            if (typeof onChange === 'function') {
                onChange(_this.getFullNumber(nextFormattedNumber, selectedCountry));
            }
        };
        _this.handleInputClick = function () {
            _this.setState({ isShowDropDown: false });
        };
        _this.handleFlagItemClick = function (country, event) {
            var _a = _this.props, onlyCountries = _a.onlyCountries, onChange = _a.onChange;
            var _b = _this.state, selectedCountry = _b.selectedCountry, formattedNumber = _b.formattedNumber;
            var nextSelectedCountry = onlyCountries.find(function (item) { return item.iso2 === country.iso2; });
            if (nextSelectedCountry && selectedCountry.iso2 !== nextSelectedCountry.iso2) {
                var nextFormattedNumber = helpers_1.formatNumber(formattedNumber.replace(/\D/g, ''), _this.getNumberFormat(nextSelectedCountry));
                _this.setState({
                    formattedNumber: nextFormattedNumber,
                    isShowDropDown: false,
                    selectedCountry: nextSelectedCountry,
                    freezeSelection: true
                }, function () {
                    if (_this.numberInputRef) {
                        _this.numberInputRef.focus();
                    }
                });
                if (typeof onChange === 'function') {
                    onChange(_this.getFullNumber(nextFormattedNumber, nextSelectedCountry));
                }
            }
            else {
                _this.setState({ isShowDropDown: false });
            }
        };
        _this.handleInputFocus = function () {
            var onFocus = _this.props.onFocus;
            var _a = _this.state, formattedNumber = _a.formattedNumber, selectedCountry = _a.selectedCountry;
            if (typeof onFocus === 'function') {
                onFocus({ number: formattedNumber, country: selectedCountry });
            }
            _this.fillDialCode();
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
        _this.getCountryPlaceholder = function (country) {
            var placeholder = _this.props.placeholder;
            if (placeholder) {
                return placeholder;
            }
            var format = _this.getNumberFormat(country);
            var nextPlaceholder = '';
            var count = 1;
            for (var i = 0; i < format.length; i++) {
                if (format[i] === '.') {
                    nextPlaceholder += count.toString();
                    count++;
                }
                else {
                    nextPlaceholder += format[i];
                }
            }
            return 'e.g: ' + nextPlaceholder;
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
                return (React.createElement("li", { ref: "flag_no_" + index, key: "flag_no_" + index, "data-flag-key": "flag_no_" + index, className: itemClasses, "data-dial-code": "1", "data-country-code": country.iso2, onClick: function () { return _this.handleFlagItemClick(country); } },
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
            var _a = _this.state, formattedNumber = _a.formattedNumber, selectedCountry = _a.selectedCountry;
            if (typeof onBlur === 'function') {
                onBlur(_this.getFullNumber(formattedNumber, selectedCountry));
            }
        };
        var preferredCountries = _this.props.preferredCountries;
        var nextPreferredCountries = preferredCountries.filter(function (iso2) { return iso2Lookup.hasOwnProperty(iso2); })
            .map(function (iso2) { return iso2Lookup.hasOwnProperty(iso2) ? allCountries[iso2Lookup[iso2]] : null; });
        _this.state = __assign({ preferredCountries: nextPreferredCountries, isShowDropDown: false, queryString: '', freezeSelection: false, debouncedQueryStingSearcher: function () { return window.setTimeout(_this.searchCountry, 300); } }, _this.mapPropsToState(_this.props));
        return _this;
    }
    RCPhoneInput.prototype.componentDidMount = function () {
        var _this = this;
        var _a = this.props, onlyCountries = _a.onlyCountries, withIpLookup = _a.withIpLookup, onChange = _a.onChange;
        if (withIpLookup) {
            fetchJsonp('https://ipinfo.io')
                .then(function (response) { return response.json(); })
                .then(function (json) {
                var selectedCountry = onlyCountries.find(function (country) { return country.iso2 === json.country.toLowerCase(); });
                var highlightCountryIndex = allCountries.findIndex(function (item) { return item === selectedCountry; });
                if (selectedCountry && highlightCountryIndex) {
                    if (typeof onChange === 'function') {
                        onChange(_this.getFullNumber('', selectedCountry));
                    }
                    _this.setState({
                        selectedCountry: selectedCountry,
                        highlightCountryIndex: highlightCountryIndex
                    });
                }
            });
        }
        document.addEventListener('keydown', this.handleKeydown);
    };
    RCPhoneInput.prototype.componentWillReceiveProps = function (nextProps) {
        this.setState(this.mapPropsToState(nextProps));
    };
    RCPhoneInput.prototype.componentWillUnmount = function () {
        document.removeEventListener('keydown', this.handleKeydown);
    };
    RCPhoneInput.prototype.shouldComponentUpdate = function (nextProps, nextState) {
        return !lodash_1.isEqual(nextProps, this.props) || !lodash_1.isEqual(nextState, this.state);
    };
    RCPhoneInput.prototype.render = function () {
        var _this = this;
        var _a = this.props, isValid = _a.isValid, inputProps = _a.inputProps, inputId = _a.inputId, className = _a.className, autoComplete = _a.autoComplete, required = _a.required, disabled = _a.disabled, flagsImagePath = _a.flagsImagePath;
        var _b = this.state, formattedNumber = _b.formattedNumber, isShowDropDown = _b.isShowDropDown, selectedCountry = _b.selectedCountry;
        var arrowClasses = classNames({
            arrow: true,
            up: isShowDropDown
        });
        var inputClasses = classNames({
            'form-control': true,
            'invalid-number': typeof isValid === 'function' && !isValid(formattedNumber.replace(/\D/g, ''))
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
            React.createElement("input", __assign({ onChange: this.handleInput, onClick: this.handleInputClick, onFocus: this.handleInputFocus, onBlur: this.handleInputBlur, onKeyDown: this.handleInputKeyDown, value: formattedNumber, ref: function (el) { _this.numberInputRef = el; }, type: "tel", className: inputClasses, autoComplete: autoComplete, required: required, placeholder: this.getCountryPlaceholder(selectedCountry), disabled: disabled }, otherProps)),
            React.createElement("div", { ref: function (el) { _this.flagDropDownButtonRef = el; }, className: flagViewClasses, onKeyDown: this.handleKeydown },
                React.createElement("div", { ref: function (el) { _this.selectedFlagRef = el; }, onClick: this.handleFlagDropdownClick, className: "selected-flag", title: selectedCountry.name + ": + " + selectedCountry.dialCode },
                    React.createElement("div", { className: inputFlagClasses, style: inputFlagStyles },
                        React.createElement("div", { className: arrowClasses }))),
                isShowDropDown ? this.getCountryDropDownList() : '')));
    };
    RCPhoneInput.prototype.getElement = function (index) {
        return this.refs["flag_no_" + index];
    };
    RCPhoneInput.prototype.getFullNumber = function (formattedNumber, selectedCountry) {
        return helpers_1.formatNumber(selectedCountry.dialCode + formattedNumber.replace(/\D/g, ''), selectedCountry.format);
    };
    RCPhoneInput.prototype.fillDialCode = function () {
        var selectedCountry = this.state.selectedCountry;
        if (this.numberInputRef && this.numberInputRef.value === '+') {
            this.setState({ formattedNumber: '+' + selectedCountry.dialCode });
        }
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