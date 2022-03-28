import { term } from "../utils/terminal/terminal_utils";

import {TreeList} from "./TreeList";
import {ProblemView} from "./ProblemView";
import CSES, {ProblemOverview} from "cses-api";
import {config} from "../config";


// const problemSet: ProblemSet = await cses.getProblemSet();

export class SelectorMenu {


    async selectProblem() {
        term.fullscreen(true);
        term.hideCursor();
        const cses = new CSES(config.user);
        const problemSet = await cses.getProblemSet();
        const tree = new TreeList(problemSet);
        await new ProblemView(cses, tree)
        term.on('key', name => {
            if (name == "CTRL_C") {
                term.fullscreen(false);
                process.exit(0);
            }
        });
        return new Promise<[string,ProblemOverview]>(res => tree.on('select', res))
    }

    exit() {
        term.fullscreen(false);
    }
}


