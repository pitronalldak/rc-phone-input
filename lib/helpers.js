"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var libphonenumber_js_1 = require("libphonenumber-js");
exports.validateNumber = function (country, number) {
    try {
        var phoneNumber = libphonenumber_js_1.parsePhoneNumber(number);
        if (phoneNumber &&
            phoneNumber.isValid() &&
            phoneNumber.country === country.iso2.toUpperCase()) {
            return phoneNumber.format('E.164');
        }
        return undefined;
    }
    catch (e) {
        return undefined;
    }
};
//# sourceMappingURL=helpers.js.map