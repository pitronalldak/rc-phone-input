"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function removeCountryCode(country, number) {
    return number.replace(/\D/g, '').replace("" + country.dialCode, '');
}
exports.removeCountryCode = removeCountryCode;
exports.formatNumber = function (text, pattern) {
    if (!text || text.length === 0) {
        return '';
    }
    var formattedObject = pattern.split('').reduce(function (acc, character) {
        if (acc.remainingText.length === 0) {
            return acc;
        }
        if (character !== '.') {
            return {
                formattedText: acc.formattedText + character,
                remainingText: acc.remainingText
            };
        }
        return {
            formattedText: acc.formattedText + acc.remainingText[0],
            remainingText: acc.remainingText.slice(1, acc.remainingText.length)
        };
    }, { formattedText: '', remainingText: text.split('') });
    return (formattedObject.formattedText + formattedObject.remainingText.join(''));
};
//# sourceMappingURL=helpers.js.map