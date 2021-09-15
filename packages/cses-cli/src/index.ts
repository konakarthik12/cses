#!/usr/bin/env node
export const log = require('why-is-node-running') // should be your first require
import {readdirSync} from "fs-extra";
// import "./commands/setup"
// import "./commands/login"
// import "./commands/status"
// import "./commands/test"
// import "./commands/select"
import {term} from "./utils/terminal/terminal_utils";
import {program} from "commander"
import path from "path";
// process.stdin.setRawMode(true);


if (process.env["INIT_CWD"]) process.chdir(process.env["INIT_CWD"]);
readdirSync(path.join(__dirname, 'commands')).map(it => path.join(__dirname, 'commands', it)).forEach(require);

let exit = () => {
    term.hideCursor(false);
    process.exit(0);
};
[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
    process.on(eventType, exit);
})
term.on('key', key => {
    if (key === 'CTRL_C') exit();
})
program.parseAsync().catch(console.error).finally(exit);
