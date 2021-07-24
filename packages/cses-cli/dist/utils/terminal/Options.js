"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.selectOption = void 0;
const terminal_utils_1 = require("./terminal_utils");
async function selectOption(question, options, select) {
    if (question)
        terminal_utils_1.term.cyan(question);
    let yShift = options.length + 1;
    for (let i = 0; i < yShift; i++)
        terminal_utils_1.term('\n');
    terminal_utils_1.term.up(yShift);
    const { selectedText } = await (terminal_utils_1.term.singleColumnMenu(options, { selectedIndex: Math.max(options.indexOf(select), 0) }).promise);
    terminal_utils_1.term.up(yShift);
    terminal_utils_1.term.eraseDisplayBelow();
    terminal_utils_1.term.cyan(`${question}: `).blue(selectedText)('\n');
    return selectedText;
}
exports.selectOption = selectOption;
