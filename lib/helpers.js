"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var libphonenumber = require("google-libphonenumber");
var PhoneNumberUtil = libphonenumber.PhoneNumberUtil, PhoneNumberFormat = libphonenumber.PhoneNumberFormat;
var phoneUtil = PhoneNumberUtil.getInstance();
exports.validateNumber = function (country, number) {
    try {
        var phone = phoneUtil.parse(number, country.iso2.toUpperCase());
        var isValid = phoneUtil.isValidNumberForRegion(phone, country.iso2.toUpperCase());
        if (isValid) {
            return phoneUtil.format(phone, PhoneNumberFormat.E164);
        }
        return undefined;
    }
    catch (e) {
        return undefined;
    }
};
//# sourceMappingURL=helpers.js.map