import {Tester} from "./tester";
import {config} from "../config";
import {writeFileSync} from "fs";

export class TestCase {
    private tester: Tester;
    status: 'queued' | 'running' | 'finished' = 'queued'
    readonly index: number;
    private res: (value: void) => void;
    private rej: (value: void) => void;
    promise: Promise<void>;
    ansData: string;
    inData: string;
    private outData: string;

    constructor(tester: Tester, i: number, inData: string, ansData: string) {
        this.tester = tester;
        this.index = i;
        this.promise = new Promise((res, rej) => {
            this.res = res;
            this.rej = rej;
        })
        this.inData = inData;
        this.ansData = ansData;
    }


    async start() {
        if (this.tester.failed) {
            this.finish(true)
            return
        }
        if (this.status === 'running') return;
        this.status = 'running'
        const execaCommand = (await import('execa')).execaCommand;

        execaCommand(config.commands.run, {input: this.inData}).then(it => {
            this.outData = it.stdout;
            if (this.outData.trim() !== this.ansData.trim()) {
                this.finish(false,this)
            } else {
                this.finish(true);

            }
        }).catch(e => {
            this.finish(false, e)
        })
    }

    private finish(success, e?) {
        this.status = 'finished';

        if (success) {
            this.res();
            this.tester.emit('finish', this)
        } else {
            this.rej(e);
            this.tester.emit('failed', this, e)

        }


    }

    saveData(path: string) {
        writeFileSync(`${path}.in`, this.inData ?? '');
        writeFileSync(`${path}.out`, this.outData ?? '');
        writeFileSync(`${path}.ans`, this.ansData ?? '');

    }

}
