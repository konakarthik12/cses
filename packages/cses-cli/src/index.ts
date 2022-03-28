#! /usr/bin/env node
import {program} from "commander";
import {readdirSync} from "fs";

import {term} from "./utils/terminal/terminal_utils";
import path from "path";

let exit = (eventType?) => {

    term.hideCursor(false);
    if (eventType != 'exit') process.exit();
};
term.on('key', key => {
    if (key === 'CTRL_C') exit();
});
if (process.env["INIT_CWD"]) process.chdir(process.env["INIT_CWD"]);
// let commandList = readdirSync(dirname(import.meta.url, 'commands'));
// const commands = commandList.map(it => import(dirname(import.meta.url, 'commands', it)));
let commandList = readdirSync(path.join(__dirname, 'commands'));
const commandFiles = commandList.map(it => path.join(__dirname, 'commands', it));
const commands = commandFiles.map(it=> import(it));

// [`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {
//     process.on(eventType, () => exit(eventType));
// });

(async () => {
    await Promise.all(commands);

    try {
        await program.parseAsync()
    } catch (e) {
        console.log("Failure")
        console.error(e)
    } finally {
        exit();
    }
})();

