"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isNumber = exports.extractLast = exports.extract = void 0;
function extract(str, afterSubstring, beforeString) {
    let start = str.indexOf(afterSubstring) + afterSubstring.length;
    if (start === -1)
        throw `Can't find ${afterSubstring} in ${str}`;
    let end = str.indexOf(beforeString, start);
    if (end === -1)
        throw `Can't find ${beforeString} in ${str}`;
    return str.slice(start, end);
}
exports.extract = extract;
function extractLast(str, afterSubstring, beforeString) {
    let start = str.lastIndexOf(afterSubstring) + afterSubstring.length;
    if (start === -1)
        throw `Can't find ${afterSubstring} in ${str}`;
    let end = str.indexOf(beforeString, start);
    if (end === -1)
        throw `Can't find ${beforeString} in ${str}`;
    return str.slice(start, end);
}
exports.extractLast = extractLast;
function isNumber(num) {
    return num == +num;
}
exports.isNumber = isNumber;
