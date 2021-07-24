"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureLoggedIn = void 0;
const commander_1 = require("commander");
const config_1 = require("../config");
const cses_api_1 = __importDefault(require("cses-api"));
const Question_1 = require("../utils/terminal/Question");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
commander_1.program
    .command('login')
    .description('store cses username and password for login')
    .action(login);
async function login() {
    const username = await Question_1.askQuestion("Username", config_1.config.user?.name);
    const password = await Question_1.askQuestion("Password", null, false, true);
    config_1.config.user = await cses_api_1.default.getUser(username, password);
    if (config_1.config.user?.id) {
        terminal_utils_1.term.green(config_1.config.user.name)(' is signed in');
    }
    else {
        terminal_utils_1.term.red("Log in failed");
    }
    await terminal_utils_1.term('\n');
}
async function ensureLoggedIn() {
    while (!config_1.config.user?.id) {
        await login();
    }
}
exports.ensureLoggedIn = ensureLoggedIn;
