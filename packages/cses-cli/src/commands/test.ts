import {program} from "commander";
import {Tester} from "../tester/tester.js";
import {term} from "../utils/terminal/terminal_utils.js";
import {TestCase} from "../tester/test_case.js";

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

    term("Loading Test Cases...\n")
    await tester.init();
    await tester.compile();

    term("Executing...\n")

    /*    const progressBar = term.progressBar({
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
        })*/
    try {
        await tester.run();
        term("\nAll cases passed\n")
    } catch (e) {
        if(e instanceof TestCase){
            term.error.red(`\nTest case #${e.index} failed\n`)

            e.saveData("failed")
        } else {
            term.error.red(e);
        }
        term.noFormat('\n')

    }

}

