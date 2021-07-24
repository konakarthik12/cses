"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeList = void 0;
const PageList_1 = require("../utils/terminal/PageList");
const terminal_kit_1 = require("terminal-kit");
class TreeList extends PageList_1.PageList {
    constructor(problemSet) {
        const w = Math.max(...(Object.values(problemSet).flatMap(it => it).map(it => it.name.length))) + 2;
        super(1, 1, w, terminal_kit_1.terminal.height);
        this.problemSet = problemSet;
        this.key = null;
        this.draw();
        this.on('hover' +
            '', item => {
            if (item?.id)
                this.emit('problem', this.curItem);
            else
                this.emit('problem');
        });
    }
    get key() {
        return this._key;
    }
    set key(value) {
        this._key = value;
        if (this.key) {
            this.list = ['..', ...(this.problemSet[this.key])];
        }
        else {
            this.list = Object.keys(this.problemSet);
        }
        this.home();
        this.borders({ topLeft: value ?? 'Sections' });
    }
    text(item) {
        return item?.name ?? item;
    }
    select() {
        if (!this.key)
            this.key = this.curItem;
        else if (this.curItem === '..')
            this.back();
        else
            this.emit('select', [this.key, this.curItem]);
    }
    back() {
        if (this.key)
            this.key = null;
    }
    style(i) {
        let style = super.style(i);
        if (!this.key || i === 0)
            return style;
        let status = this.list[i].status;
        if (status === "full") {
            style = style.green;
        }
        else if (status === "zero") {
            style = style.red;
        }
        return style;
    }
}
exports.TreeList = TreeList;
