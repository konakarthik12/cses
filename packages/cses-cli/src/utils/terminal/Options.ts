import {term} from "./terminal_utils.js";

export async function selectOption(question: string, options: string[], select?: string) {
    if (question) term.cyan(question);

    let yShift = options.length + 1;
    for (let i = 0; i < yShift; i++) term('\n')
    term.up(yShift)
    const {selectedText} = await (term.singleColumnMenu(options, {selectedIndex: Math.max(options.indexOf(select), 0)}).promise);
    term.up(yShift);
    term.eraseDisplayBelow();
    term.cyan(`${question}: `).blue(selectedText)('\n');
    return selectedText
}
