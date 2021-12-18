#!/usr/bin/env -S node --experimental-json-modules --no-warnings
import {program} from "commander";
import {readdirSync} from "fs";

// import "./commands/select.js"
import {term} from "./utils/terminal/terminal_utils.js";
import {dirname} from "./utils/utils.js";
import {proxy} from "./config";

let exit = (eventType?) => {
    term.hideCursor(false);
    if (eventType != 'exit') process.exit();
};
term.on('key', key => {
    if (key === 'CTRL_C') exit();
});
if (process.env["INIT_CWD"]) process.chdir(process.env["INIT_CWD"]);
let commandList = readdirSync(dirname(import.meta.url, 'commands'));
const commands = commandList.map(it => import(dirname(import.meta.url, 'commands', it)));

/*[`exit`, `SIGINT`, `SIGUSR1`, `SIGUSR2`, `uncaughtException`, `SIGTERM`].forEach((eventType) => {

    process.on(eventType, () => exit(eventType));
});*/

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

