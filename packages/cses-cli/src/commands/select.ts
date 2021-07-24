import {program} from "commander";
import {SelectorMenu} from "../selector/SelectorMenu";
import {config} from "../config";
import {term} from "../utils/terminal/terminal_utils";
import CSES from "cses-api";


program
    .command('select')
    .description('set current cses problem')
    .action(select);

async function select() {
    let menu = new SelectorMenu();
    const [section, task] = await menu.selectProblem()
    menu.exit();
    config.selected = task.id;
    const cses = new CSES(config.user);
    //todo: save sample case
    term('Selected problem: ').green(`${section} - ${task.name}\n`)

}

