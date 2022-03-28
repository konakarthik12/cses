import {PageList} from "../utils/terminal/PageList";
import {ProblemOverview, ProblemSet} from "cses-api";
import type {CTerminal} from "terminal-kit/Terminal";
import { term } from "../utils/terminal/terminal_utils";

export class TreeList extends PageList<ProblemOverview | string> {
    problemSet: ProblemSet
    _key: string

    get key() {
        return this._key
    }

    set key(value) {
        this._key = value;
        if (this.key) {
            this.list = ['..', ...(this.problemSet[this.key])]
        } else {
            this.list = Object.keys(this.problemSet)
        }
        this.home();
        this.borders({topLeft: value ?? 'Sections'})

    }

    text(item: ProblemOverview | string) {
        return (item as ProblemOverview)?.name ?? item as string;
    }

    constructor(problemSet: ProblemSet) {
        const w = Math.max(...(Object.values(problemSet).flatMap(it => it).map(it => it.name.length))) + 2;
        super(1, 1, w, term.height);

        this.problemSet = problemSet;

        this.key = null;

        this.draw();

        this.on('hover' +
            '', item => {
            if (item?.id) this.emit('problem', this.curItem)
            else this.emit('problem')
        })
    }


    select() {
        if (!this.key) this.key = this.curItem as string
        else if (this.curItem === '..') this.back();
        else this.emit('select', [this.key,this.curItem])
    }

    back() {
        if (this.key) this.key = null
    }


    style(i: number): CTerminal {
        let style = super.style(i);
        if (!this.key || i === 0) return style;
        let status = (this.list[i] as ProblemOverview).status;
        if (status === "full") {
            style = style.green
        } else if (status === "zero") {
            style = style.red;
        }
        return style;
    }


}
