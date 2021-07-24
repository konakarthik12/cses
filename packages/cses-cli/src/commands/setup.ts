import {program} from "commander";
import {config} from "../config";

import {term} from "../utils/terminal/terminal_utils";
import {askQuestion} from "../utils/terminal/Question";
import {ensureLoggedIn} from "./login";
import path from "path";
import {selectOption} from "../utils/terminal/Options";

export const languages = [
    'Assembly', 'C++', 'Haskell', 'Java', 'Node.js',
    'Pascal', 'Python2', 'Python3', 'Ruby', 'Rust', 'Scala'
];
export const options = {"C++": ["C++11", "C++17"], "Python2": ["CPython2", "PyPy2"], "Python3": ["CPython3", "PyPy3"]}
export const extensions = {
    ".asm": "Assembly",
    ".cpp": "C++",
    ".hs": "Haskell",
    ".java": "Java",
    ".js": "Node.js",
    ".pas": "Pascal",
    ".py": "Python2",
    ".rb": "Ruby",
    ".rs": "Rust",
    ".scala": "Scala",
    ".cc": "C++",
}


program
    .command('setup')
    .description('setup cses submission config')
    .action(setup);

function extLanguage(file: string) {
    return extensions[path.extname(file)];
}

export async function setup() {
    await ensureLoggedIn()
    config.settings ||= {};

    config.settings.file = await askQuestion('Select submission file', config.settings.file);

    config.settings.lang = await selectOption('Choose a language', languages, config.settings.lang ?? extLanguage(config.settings.file));
    if (options[config.settings.lang]) {
        config.settings.option = await selectOption('Select option', options[config.settings.lang], config.settings.option)
    } else {
        delete config.settings.option;
    }
    //
    config.commands ||= {};
    config.commands.compile = await askQuestion('Enter compile step', config.commands?.compile, true)
    config.commands.run = await askQuestion('Enter run step', config.commands?.run)

    term.green('Configuration complete\n')
}

