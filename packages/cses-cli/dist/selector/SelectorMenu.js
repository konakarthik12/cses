"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectorMenu = void 0;
const terminal_kit_1 = require("terminal-kit");
const TreeList_1 = require("./TreeList");
const ProblemView_1 = require("./ProblemView");
const cses_api_1 = __importDefault(require("cses-api"));
const config_1 = require("../config");
// const problemSet: ProblemSet = await cses.getProblemSet();
class SelectorMenu {
    async selectProblem() {
        terminal_kit_1.terminal.fullscreen(true);
        terminal_kit_1.terminal.hideCursor();
        const cses = new cses_api_1.default(config_1.config.user);
        const problemSet = await cses.getProblemSet();
        const tree = new TreeList_1.TreeList(problemSet);
        await new ProblemView_1.ProblemView(cses, tree);
        terminal_kit_1.terminal.on('key', name => {
            if (name == "CTRL_C") {
                terminal_kit_1.terminal.fullscreen(false);
                process.exit(0);
            }
        });
        return new Promise(res => tree.on('select', res));
    }
    exit() {
        terminal_kit_1.terminal.fullscreen(false);
    }
}
exports.SelectorMenu = SelectorMenu;
