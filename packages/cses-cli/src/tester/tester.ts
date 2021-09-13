import execa from "execa";
import {config} from "../config";
import CSES from "cses-api";
import {TestCase} from "./test_case";
import EventEmitter from "events";
import cpuCount from "physical-cpu-count";
import {term} from "../utils/terminal/terminal_utils";

export class Tester extends EventEmitter {
    cases: TestCase[] = [];

    get casesDone(): number {
        return this.cases.filter(it => (it.status === 'finished')).length;

    }

    maxParallel: number

    async init(id?: string | number) {
        const cses = new CSES(config.user);
        const caseData = await cses.getTestCases(config.selected);

        for (let i = 0; i < caseData.length; i++) {
            this.cases.push(new TestCase(this, i + 1, caseData[i][0], caseData[i][1]))
        }

        this.maxParallel = Math.min(this.cases.length, cpuCount - 1)
    }


    async compile() {
        if (!config.commands.compile) return;
        term("Compiling...\n")
        try {
            return await execa.command(config.commands.compile, {stdio: "inherit"});
        } catch (e) {
            term.error("Stopped testing -- Compilation failed\n");
            term.error(e.message)
            term('\n')
        }

    }

    run() {
        this.on('finish', () => {
            this.update();
        })
        this.update();

        return Promise.all(this.cases.map(it => it.promise))

    }

    update() {
        const waiting = this.cases.filter(it => !(it.status === 'finished'))
        waiting.slice(0, this.maxParallel).forEach(it => it.start());
    }


}
