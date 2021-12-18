import {program} from "commander";
import {Tester} from "../tester/tester";
import {term} from "../utils/terminal/terminal_utils";

program
    .command('test [id]')
    .description('run test case against active problem')
    .action(test);


async function test(id: number) {


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
    let tester = new Tester();
    tester.on('failed', async (test, err) => {
        // throw 'what';
        term.error.red(`\nTest case #${test.index} failed\n`)
        if(err) term.error.red(err);
        term.noFormat('\n')
        test.saveData("failed")
        process.exit();
    })
    console.log("Loading Test Cases...")
    await tester.init();
    await tester.compile();

    console.log("Executing...")

    const progressBar = term.progressBar({
        width: 50,
        title: `${tester.casesDone} cases executed`,
        titleSize: 20,
        percent: true
    });
    tester.on('finish', () => {
        progressBar.update({
            progress: tester.casesDone / tester.cases.length,
            title: `${tester.casesDone} cases executed`
        })
    })
    await tester.run();
    term("\nAll cases passed\n")
}

