import {Tester} from "./tester";
import execa from "execa";
import {config} from "../config";
import {writeFileSync} from "fs";

export class TestCase {
    private tester: Tester;
    status: 'queued' | 'running' | 'finished' = 'queued'
    private readonly index: number;
    private res: (value: void) => void;
    promise: Promise<void>;
    private failed = false
    ansData: string;
    inData: string;
    private outData: string;

    constructor(tester: Tester, i: number, inData: string, ansData: string) {
        this.tester = tester;
        this.index = i;
        this.promise = new Promise(res => this.res = res)
        this.inData = inData;
        this.ansData = ansData;
    }


    start() {
        if (this.status === 'running') return;
        this.status = 'running'

        execa.command(config.commands.run, {input: this.inData}).then(it => {
            this.outData = it.stdout;
            if (this.outData.trim() !== this.ansData.trim()) {
                this.failed = true;
                this.tester.emit('failed', this)
            } else {
                this.finish();

            }
        }).catch(e => {
            this.failed = true;
            this.tester.emit('failed', this, e.stderr)
        })
    }

    private finish() {
        // console.log("Finished case " + this.index)
        this.res();
        this.status = 'finished';
        this.tester.emit('finish', this)
    }

    saveData(path: string) {
        writeFileSync(`${path}.in`, this.inData);
        writeFileSync(`${path}.out`, this.outData);
        writeFileSync(`${path}.ans`, this.ansData);

    }
}
