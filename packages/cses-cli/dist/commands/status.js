"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const config_1 = require("../config");
const cses_api_1 = __importDefault(require("cses-api"));
const login_1 = require("./login");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
commander_1.program
    .command('status')
    .description('check cses profile status')
    .action(status);
async function status() {
    await login_1.ensureLoggedIn();
    const cses = new cses_api_1.default(config_1.config.user);
    const status = await cses.getStatus(config_1.config.user.id);
    const tableData = Object.entries(status);
    for (const [key, value] of tableData)
        terminal_utils_1.term.cyan(`${key}: `)(value)('\n');
}
