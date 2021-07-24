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
const sleep_promise_1 = __importDefault(require("sleep-promise"));
const fs_1 = require("fs");
const symbols_1 = require("../utils/symbols");
commander_1.program
    .command('submit')
    .description('submit cses problem')
    .action(async () => {
    await login_1.ensureLoggedIn();
    const cses = new cses_api_1.default(config_1.config.user);
    terminal_utils_1.term("Submitting file " + config_1.config.settings.file + " for problem #" + config_1.config.selected + '\n');
    let submit_id = await cses.submit({
        task: config_1.config.selected,
        lang: config_1.config.settings.lang,
        type: 'course',
        target: 'problemset',
        file: fs_1.createReadStream(config_1.config.settings.file)
    });
    if (!submit_id) {
        console.error("Submit failed");
        return;
    }
    const progressBar = terminal_utils_1.term.progressBar({
        width: 50,
        title: `Submitting File...`,
        titleSize: 20,
        percent: true
    });
    while (true) {
        let progress = await cses.getSubmitStatus(submit_id);
        if (progress == "READY" || progress == "COMPILE ERROR")
            break;
        progressBar.update(progress);
        await sleep_promise_1.default(500);
    }
    progressBar.update(1);
    let results = await cses.getSubmitResults(submit_id);
    terminal_utils_1.term("\nResults:\n");
    await resultsList(results);
});
async function resultsList(results) {
    let rows = results.map(it => [it.index, it.verdict, it.time]);
    const columnWidth = [];
    for (const row of rows) {
        for (let j = 0; j < row.length; j++)
            columnWidth[j] = Math.max(columnWidth[j] || 0, row[j].length);
    }
    // let width = columnWidth.reduce((prev, cur) => prev + cur + 1, 0);
    let height = rows.length * 2 + 1;
    // for (let i = 0; i < height; i++) term('\n')
    // term.up(height)
    terminal_utils_1.term(symbols_1.box.topLeft);
    for (let j = 0; j < rows[0].length; j++) {
        terminal_utils_1.term(''.padEnd(columnWidth[j], symbols_1.box.top));
        if (j == rows[0].length - 1)
            terminal_utils_1.term(symbols_1.box.topRight);
        else
            terminal_utils_1.term('┬');
    }
    terminal_utils_1.term('\n');
    for (let i = 0; i < rows.length; i++) {
        terminal_utils_1.term(symbols_1.box.left);
        for (let j = 0; j < rows[i].length; j++) {
            let paddedString = rows[i][j].padEnd(columnWidth[j]);
            if (j == 1) {
                terminal_utils_1.term.color(results[i].verdictColor, paddedString);
            }
            else {
                terminal_utils_1.term(paddedString);
            }
            terminal_utils_1.term(symbols_1.box.right);
        }
        terminal_utils_1.term('\n');
    }
    terminal_utils_1.term(symbols_1.box.left);
    for (let j = 0; j < rows[0].length; j++) {
        terminal_utils_1.term(''.padEnd(columnWidth[j], symbols_1.box.bottom));
        if (j == rows[0].length - 1)
            terminal_utils_1.term(symbols_1.box.bottomRight);
        else
            terminal_utils_1.term(symbols_1.box.bottomMiddle);
    }
    terminal_utils_1.term('\n');
}
