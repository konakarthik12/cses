import {program} from "commander";
import {config} from "../config";
import CSES, {Result} from "cses-api";
import {ensureLoggedIn} from "./login";
import {term} from "../utils/terminal/terminal_utils";
import sleep from "sleep-promise";
import {createReadStream} from "fs";
import {box} from "../utils/symbols";

program
    .command('submit')
    .description('submit cses problem')
    .action(async () => {

        await ensureLoggedIn();

        const cses = new CSES(config.user);
        term("Submitting file " + config.settings.file + " for problem #" + config.selected + '\n')
        let submit_id = await cses.submit({
            task: config.selected,
            lang: config.settings.lang,
            type: 'course',
            target: 'problemset',
            file: createReadStream(config.settings.file)
        });
        if (!submit_id) {
            console.error("Submit failed")
            return;
        }

        const progressBar = term.progressBar({
            width: 50,
            title: `Submitting File...`,
            titleSize: 20,
            percent: true
        });
        while (true) {
            let progress = await cses.getSubmitStatus(submit_id);

            if (progress == "READY" || progress == "COMPILE ERROR") break;
            progressBar.update(progress);
            await sleep(500);
        }
        progressBar.update(1)
        let results = await cses.getSubmitResults(submit_id);

        term("\nResults:\n")
        await resultsList(results);
    });


async function resultsList(results: Result[]) {
    let rows = results.map(it => [it.index, it.verdict, it.time]);
    const columnWidth = [];
    for (const row of rows) {
        for (let j = 0; j < row.length; j++) columnWidth[j] = Math.max(columnWidth[j] || 0, row[j].length)
    }
    // let width = columnWidth.reduce((prev, cur) => prev + cur + 1, 0);

    let height = rows.length * 2 + 1;
    // for (let i = 0; i < height; i++) term('\n')
    // term.up(height)
    term(box.topLeft)
    for (let j = 0; j < rows[0].length; j++) {
        term(''.padEnd(columnWidth[j], box.top))
        if (j == rows[0].length - 1) term(box.topRight); else term('┬')
    }

    term('\n')

    for (let i = 0; i < rows.length; i++) {
        term(box.left)
        for (let j = 0; j < rows[i].length; j++) {
            let paddedString = rows[i][j].padEnd(columnWidth[j]);
            if (j == 1) {
                term.color(results[i].verdictColor, paddedString)
            } else {
                term(paddedString)

            }
            term(box.right)
        }
        term('\n')
    }
    term(box.bottomLeft)
    for (let j = 0; j < rows[0].length; j++) {
        term(''.padEnd(columnWidth[j], box.bottom))
        if (j == rows[0].length - 1) term(box.bottomRight); else term(box.bottomMiddle)
    }
    term('\n')

}
