"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var resolvePhoneNumber = function (country, input) {
    if (input.length < 4) {
        return;
    }
    var cleanNumber = input.replace(/[^\d+]/g, '');
    if (!cleanNumber) {
        return;
    }
    if (cleanNumber.length < 8) {
        return;
    }
    if (input[0] === '+') {
        return cleanNumber;
    }
    return "+" + country.dialCode + cleanNumber;
};
var isPhoneNumberValid = function (phoneNumber) {
    return new RegExp(/^[+]*([-\s\./0-9]*)+$/).test("" + (phoneNumber || ''));
};
exports.validateNumber = function (country, input) {
    var phoneNumber = resolvePhoneNumber(country, input);
    if (phoneNumber && isPhoneNumberValid(phoneNumber)) {
        return phoneNumber;
    }
    return undefined;
};
//# sourceMappingURL=helpers.js.map