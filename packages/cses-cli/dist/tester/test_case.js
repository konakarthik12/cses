"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TestCase = void 0;
const execa_1 = __importDefault(require("execa"));
const config_1 = require("../config");
const fs_1 = require("fs");
class TestCase {
    constructor(tester, i, inData, ansData) {
        this.status = 'queued';
        this.failed = false;
        this.tester = tester;
        this.index = i;
        this.promise = new Promise(res => this.res = res);
        this.inData = inData;
        this.ansData = ansData;
    }
    start() {
        if (this.status === 'running')
            return;
        this.status = 'running';
        execa_1.default.command(config_1.config.commands.run, { input: this.inData }).then(it => {
            this.outData = it.stdout;
            if (this.outData.trim() !== this.ansData.trim()) {
                this.failed = true;
                this.tester.emit('failed', this);
            }
            else {
                this.finish();
            }
        }).catch(e => {
            this.failed = true;
            this.tester.emit('failed', this, e.stderr);
        });
    }
    finish() {
        // console.log("Finished case " + this.index)
        this.res();
        this.status = 'finished';
        this.tester.emit('finish', this);
    }
    saveData(path) {
        fs_1.writeFileSync(`${path}.in`, this.inData);
        fs_1.writeFileSync(`${path}.out`, this.outData);
        fs_1.writeFileSync(`${path}.ans`, this.ansData);
    }
}
exports.TestCase = TestCase;
