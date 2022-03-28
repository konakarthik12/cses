import {Rec} from "cses-api";

import CSES from "cses-api";
import {Element} from "../utils/terminal/Element";
import {term} from "../utils/terminal/terminal_utils";
import {TreeList} from "./TreeList";

let lastProblem;

export class ProblemView extends Element {
    key?: string
    cses: CSES;

    constructor(cses, tree: TreeList) {
        super(tree.x + tree.width, tree.y, term.width - tree.width - 1, term.height)
        this.cses = cses;
        this.borders();
        term.wrapColumn({x: this.x + 1, width: this.width - 2})
        tree.on('problem', (problem) => this.setProblem(problem))

    }

    body: Rec<string>

    get tabs() {
        return Object.keys(this.body)
    }

    index = 0;

    clearBody() {
        term.eraseArea(this.l, this.t, this.h, this.v)

    }

    async setProblem(problem) {
        if (!problem) {
            this.body = null;
            this.borders()
            this.clearBody();

        } else {
            lastProblem = problem.id
            const {title, limits, body} = problem.details;
            if (lastProblem != problem.id) return;
            this.body = body;
            this.index = 0;
            this.borders({topLeft: title, topRight: limits.join(', ')});
            this.drawBody();
        }
    }

    left() {
        this.index--;
        if (this.index < 0) this.index = this.tabs.length - 1;
        this.drawBody()
    }


    right() {
        this.index++;
        if (this.index >= this.tabs.length) this.index = 0;
        this.drawBody()
    }


    drawBody() {
        this.clearBody();
        if (!this.body) return;
        term.moveTo(this.x + 1, this.y + 1)
        let tabs = this.tabs;
        for (let i = 0; i < tabs.length; i++) {
            const style = i == this.index ? term.blue.inverse : term.blue
            style(tabs[i])
            if (i != tabs.length - 1) term(' ')
        }
        term('\n')
        let section = Object.values(this.body)[this.index];
        term.wrap.noFormat(section)('\n')
    }
}
