"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const SelectorMenu_1 = require("../selector/SelectorMenu");
const config_1 = require("../config");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
const cses_api_1 = __importDefault(require("cses-api"));
commander_1.program
    .command('select')
    .description('set current cses problem')
    .action(select);
async function select() {
    let menu = new SelectorMenu_1.SelectorMenu();
    const [section, task] = await menu.selectProblem();
    menu.exit();
    config_1.config.selected = task.id;
    const cses = new cses_api_1.default(config_1.config.user);
    //todo: save sample case
    terminal_utils_1.term('Selected problem: ').green(`${section} - ${task.name}\n`);
}
