"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProblemView = void 0;
const Element_1 = require("../utils/terminal/Element");
const terminal_utils_1 = require("../utils/terminal/terminal_utils");
let lastProblem;
class ProblemView extends Element_1.Element {
    constructor(cses, tree) {
        super(tree.x + tree.width, tree.y, terminal_utils_1.term.width - tree.width - 1, terminal_utils_1.term.height);
        this.index = 0;
        this.cses = cses;
        this.borders();
        terminal_utils_1.term.wrapColumn({ x: this.x + 1, width: this.width - 2 });
        tree.on('problem', (problem) => this.setProblem(problem));
    }
    get tabs() {
        return Object.keys(this.body);
    }
    clearBody() {
        terminal_utils_1.term.eraseArea(this.l, this.t, this.h, this.v);
    }
    async setProblem(problem) {
        if (!problem) {
            this.body = null;
            this.borders();
            this.clearBody();
        }
        else {
            lastProblem = problem.id;
            const { title, limits, body } = problem.details;
            if (lastProblem != problem.id)
                return;
            this.body = body;
            this.index = 0;
            this.borders({ topLeft: title, topRight: limits.join(', ') });
            await this.drawBody();
        }
    }
    left() {
        this.index--;
        if (this.index < 0)
            this.index = this.tabs.length - 1;
        this.drawBody();
    }
    right() {
        this.index++;
        if (this.index >= this.tabs.length)
            this.index = 0;
        this.drawBody();
    }
    async drawBody() {
        this.clearBody();
        if (!this.body)
            return;
        terminal_utils_1.term.moveTo(this.x + 1, this.y + 1);
        let tabs = this.tabs;
        for (let i = 0; i < tabs.length; i++) {
            const style = i == this.index ? terminal_utils_1.term.blue.inverse : terminal_utils_1.term.blue;
            style(tabs[i]);
            if (i != tabs.length - 1)
                terminal_utils_1.term(' ');
        }
        terminal_utils_1.term('\n');
        let section = Object.values(this.body)[this.index];
        terminal_utils_1.term.wrap.noFormat(section)('\n');
    }
}
exports.ProblemView = ProblemView;
//
// async function getPlainProblem(cses: CSES, id: number): Promise<{ title: string, limits: string, body: Rec<string> }> {
//
//
//     let {title, limits, body} = await cses.getProblemDetails(id);
//     for (const [key, value] of Object.entries(body)) body[key] = await htmlToText(value)
//     return {
//         title,
//         limits: limits.join(', '),
//         body: body
//     };
//
//
// }
