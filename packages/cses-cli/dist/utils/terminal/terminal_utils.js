"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cursorLocation = exports.term = void 0;
const terminal_kit_1 = require("terminal-kit");
terminal_kit_1.terminal.grabInput({});
exports.term = terminal_kit_1.terminal;
async function cursorLocation() {
    // @ts-ignore
    return exports.term.getCursorLocation();
}
exports.cursorLocation = cursorLocation;
