"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tester = void 0;
const execa_1 = __importDefault(require("execa"));
const config_1 = require("../config");
const cses_api_1 = __importDefault(require("cses-api"));
const test_case_1 = require("./test_case");
const events_1 = __importDefault(require("events"));
const physical_cpu_count_1 = __importDefault(require("physical-cpu-count"));
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
class Tester extends events_1.default {
    constructor() {
        super(...arguments);
        this.cases = [];
    }
    get casesDone() {
        return this.cases.filter(it => (it.status === 'finished')).length;
    }
    async init(id) {
        const cses = new cses_api_1.default(config_1.config.user);
        const caseData = await cses.getTestCases(config_1.config.selected);
        for (let i = 0; i < caseData.length; i++) {
            this.cases.push(new test_case_1.TestCase(this, i + 1, caseData[i][0], caseData[i][1]));
        }
        this.maxParallel = Math.min(this.cases.length, physical_cpu_count_1.default - 1);
    }
    async compile() {
        if (!config_1.config.commands.compile)
            return;
        terminal_utils_1.term("Compiling...\n");
        try {
            return await execa_1.default.command(config_1.config.commands.compile, { stdio: "inherit" });
        }
        catch (e) {
            terminal_utils_1.term.error("Stopped testing -- Compilation failed\n");
            terminal_utils_1.term.error(e.message);
        }
    }
    run() {
        this.on('finish', () => {
            this.update();
        });
        this.update();
        return Promise.all(this.cases.map(it => it.promise));
    }
    update() {
        const waiting = this.cases.filter(it => !(it.status === 'finished'));
        waiting.slice(0, this.maxParallel).forEach(it => it.start());
    }
}
exports.Tester = Tester;
