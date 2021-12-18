import {term} from "./terminal_utils.js";
import {InputFieldOptions} from "terminal-kit/Terminal";

const keyBindings = {
    ENTER: 'submit',
    KP_ENTER: 'submit',
    ESCAPE: 'cancel',
    BACKSPACE: 'backDelete',
    DELETE: 'delete',
    LEFT: 'backward',
    RIGHT: 'forward',
    // UP: 'historyPrevious' ,
    // DOWN: 'historyNext' ,
    HOME: 'startOfInput',
    END: 'endOfInput',
    // TAB: 'autoComplete' ,
    // CTRL_R: 'autoCompleteUsingHistory' ,
    CTRL_LEFT: 'previousWord',
    CTRL_RIGHT: 'nextWord',
    ALT_D: 'deleteNextWord',
    CTRL_W: 'deletePreviousWord',
    CTRL_U: 'deleteAllBefore',
    CTRL_K: 'deleteAllAfter'
};

export async function askQuestion(question: string, default_input?: string, optional: boolean = false, password?: boolean) {
    term.cyan(`${question}: `)

    let optHint = '(optional)';
    let config: InputFieldOptions = {
        default: default_input,
        minLength: optional ? 0 : 1,
        autoCompleteHint: true,
        keyBindings
    };
    if (optional) config.autoComplete = ({length}) => length === 0 ? optHint : ''
    if (password) config.echoChar = true;


    let field = term.inputField(config).promise;

    if (optional) {
        term.grey(optHint)
        term.left(optHint.length)
    }

    const input = await field;
    term('\n')
    return input.trim();
}


// import {term} from "../terminal_utils.js";
// import sleep from "sleep-promise";
//
// let input: string = "";
// let index = 0;
// // let cursor;
// let optString = '(optional)';
//
// let res: (string) => void;
// let pass = false;
// let opt = false;
// let listener = (key, _, {isCharacter}) => {
//     handleInput(key, isCharacter)
// };
//
// function handleChar(key: string) {
//     input = input ? insertKey(input, index, key) : key;
//     index++;
// }
//
// function cleanup() {
//     term.off('key', listener)
//     if (!input && opt) opt = false;
//     res(input);
// }
//
// function handleSpecial(key: string) {
//     if (key === 'LEFT') {
//         index--;
//     } else if (key === 'RIGHT') {
//         index++;
//     } else if (key === 'BACKSPACE') {
//         input = deleteKey(input, index--)
//     } else if (key === 'DELETE') {
//         input = deleteKey(input, index + 1)
//     } else if (key === 'ENTER') {
//         if (opt || input.length) cleanup();
//     }
//     if (index < 0) index = 0;
//     if (index > input?.length ?? 0) index = input.length;
//     return true;
// }
//
// let oldStr = '';
// let oldIndex = 0;
//
// async function render() {
//     const str = input || opt && optString || '';
//     let actualStr = pass ? '•'.repeat(str.length) : str;
//     let oldStart = oldStr.slice(0, oldIndex)
//     let newStart = actualStr.slice(0, oldIndex)
//
//     if (oldStart !== newStart) {
//         shiftLeft(oldIndex)
//
//     }
//
//     let oldEnd = oldStr.slice(oldIndex)
//     let newEnd = actualStr.slice(oldIndex)
//
//     // shiftLeft(oldIndex)
//     let paddedStr = newEnd.padEnd(oldEnd.length);
//
//     text(paddedStr, opt && !input);
//     if (oldStart !== newStart) {
//         shiftLeft(paddedStr.length - index)
//     }
//     // console.log(paddedStr.length-index)
//     oldStr = str;
//     oldIndex = index;
//
//
// }
//
// function handleInput(key: string, isChar) {
//     if (isChar) {
//         handleChar(key);
//     } else {
//         handleSpecial(key);
//     }
//     render();
//
// }
//
// async function inner_question(question: string, default_input: string, optional: boolean, password: boolean): Promise<string> {
//     term.cyan(`${question}: `)
//     oldIndex = 0;
//     opt = optional;
//     input = default_input || '';
//     index = input.length
//     pass = password;
//     render()
//
//     term.on('key', listener)
//
//     return new Promise(_res => res = _res);
// }
//
//
// export async function askQuestion(question: string, default_input: string = '', optional: boolean = false, password?: boolean): Promise<string> {
//     const inner = await inner_question(question, default_input, optional, password);
//     term('\n')
//     return inner;
// }
//
// function insertKey(original: string, index: number, char: string) {
//     return original.slice(0, index) + char + original.slice(index);
// }
//
// function deleteKey(original: string, index: number) {
//     return original.slice(0, index - 1) + original.slice(index);
// }
//
// function shiftLeft(amount: number) {
//     amount && term.left(amount)
// }
//
// function shiftRight(amount: number) {
//     amount && term.right(amount)
// }
//
//
// export function text(message: string, grey = false) {
//     (grey ? term.grey : term)(message)
// }
//
