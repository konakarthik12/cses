"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const commander_1 = require("commander");
const tester_1 = require("../tester/tester");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
commander_1.program
    .command('test [id]')
    .description('run test case against active problem')
    .action(test);
async function test(id) {
    // term("Compiling ");
    //
    // let compileProcess = compile();
    // const animatedDot = new AnimatedDot();
    // while (compileProcess.exitCode === null) {
    //     term(animatedDot.toString())
    //     term.left(2)
    //     await sleep(70)
    // }
    //
    // term(tick+"  ")
    // const curProblem =
    let tester = new tester_1.Tester();
    tester.on('failed', async (test, err) => {
        // throw 'what';
        terminal_utils_1.term.error.red(`\nTest case #${test.index} failed\n`);
        if (err)
            terminal_utils_1.term.error.red(err)('\n');
        test.saveData("failed");
        process.exit();
    });
    console.log("Loading Test Cases...");
    await tester.init();
    await tester.compile();
    console.log("Executing...");
    const progressBar = terminal_utils_1.term.progressBar({
        width: 50,
        title: `${tester.casesDone} cases executed`,
        titleSize: 20,
        percent: true
    });
    tester.on('finish', () => {
        progressBar.update({
            progress: tester.casesDone / tester.cases.length,
            title: `${tester.casesDone} cases executed`
        });
    });
    await tester.run();
    terminal_utils_1.term("\nAll cases passed\n");
}
