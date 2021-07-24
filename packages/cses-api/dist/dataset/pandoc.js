"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.htmlToText = void 0;
const execa_1 = __importDefault(require("execa"));
const pandoc_binary_1 = __importDefault(require("pandoc-binary"));
async function htmlToText(input) {
    input = input.replace(/<code>/g, "<br>").replace(/<\/code>/g, "<br>");
    const latex = await convert("html", "plain", "none", input);
    return await convert("latex", "plain", "preserve", latex);
}
exports.htmlToText = htmlToText;
async function convert(from, to, wrap, input) {
    return (await execa_1.default.command(`${pandoc_binary_1.default} -f ${from} -t ${to} --wrap=${wrap}`, { input })).stdout;
}
