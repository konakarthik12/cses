#!/usr/bin/env node
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
// import "./commands/setup"
// import "./commands/login"
// import "./commands/status"
// import "./commands/test"
// import "./commands/select"
const terminal_utils_1 = require("./utils/terminal/terminal_utils");
const commander_1 = require("commander");
const path_1 = __importDefault(require("path"));
// process.stdin.setRawMode(true);
if (process.env["INIT_CWD"])
    process.chdir(process.env["INIT_CWD"]);
fs_extra_1.readdirSync(path_1.default.join(__dirname, 'commands')).map(it => path_1.default.join(__dirname, 'commands', it)).forEach(require);
let exit = () => {
    terminal_utils_1.term.hideCursor(false);
    process.exit(0);
};
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exit);
});
terminal_utils_1.term.on('key', key => {
    if (key === 'CTRL_C')
        exit();
});
commander_1.program.parseAsync().catch(console.error).finally(exit);
