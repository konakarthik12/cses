"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setup = exports.extensions = exports.options = exports.languages = void 0;
const commander_1 = require("commander");
const config_1 = require("../config");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
const Question_1 = require("../utils/terminal/Question");
const login_1 = require("./login");
const path_1 = __importDefault(require("path"));
const Options_1 = require("../utils/terminal/Options");
exports.languages = [
    'Assembly', 'C++', 'Haskell', 'Java', 'Node.js',
    'Pascal', 'Python2', 'Python3', 'Ruby', 'Rust', 'Scala'
];
exports.options = { "C++": ["C++11", "C++17"], "Python2": ["CPython2", "PyPy2"], "Python3": ["CPython3", "PyPy3"] };
exports.extensions = {
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
};
commander_1.program
    .command('setup')
    .description('setup cses submission config')
    .action(setup);
function extLanguage(file) {
    return exports.extensions[path_1.default.extname(file)];
}
async function setup() {
    await login_1.ensureLoggedIn();
    config_1.config.settings || (config_1.config.settings = {});
    config_1.config.settings.file = await Question_1.askQuestion('Select submission file', config_1.config.settings.file);
    config_1.config.settings.lang = await Options_1.selectOption('Choose a language', exports.languages, config_1.config.settings.lang ?? extLanguage(config_1.config.settings.file));
    if (exports.options[config_1.config.settings.lang]) {
        config_1.config.settings.option = await Options_1.selectOption('Select option', exports.options[config_1.config.settings.lang], config_1.config.settings.option);
    }
    else {
        delete config_1.config.settings.option;
    }
    //
    config_1.config.commands || (config_1.config.commands = {});
    config_1.config.commands.compile = await Question_1.askQuestion('Enter compile step', config_1.config.commands?.compile, true);
    config_1.config.commands.run = await Question_1.askQuestion('Enter run step', config_1.config.commands?.run);
    terminal_utils_1.term.green('Configuration complete\n');
}
exports.setup = setup;
