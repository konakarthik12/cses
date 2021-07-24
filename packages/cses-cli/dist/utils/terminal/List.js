"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.List = void 0;
const Element_1 = require("./Element");
const terminal_utils_1 = require("./terminal_utils");
class List extends Element_1.Element {
    constructor(x, y, w, h) {
        super(x, y, w, h);
        this._index = 0;
        let borders = this.borderTexts();
        if (borders) {
            this.borders(borders);
        }
    }
    get list() {
        return this._list;
    }
    set list(value) {
        this._list = value;
        this.draw();
    }
    get curItem() {
        return this.list[this._index];
    }
    borderTexts() {
        return {};
    }
    // abstract select(element: K)
    //
    // abstract back()
    //
    //
    //
    // reset() {
    //     this.draw();
    //     this.index = 0;
    // }
    //
    //
    draw() {
        terminal_utils_1.term.eraseArea(this.l, this.t, this.h, this.v);
        for (let i = 0; i < this.list.length; i++) {
            this.drawIndex(i);
        }
    }
    drawIndex(i) {
        terminal_utils_1.term.moveTo(this.l, this.t + i);
        this.style(i)(this.text(this.list[i]));
    }
    text(item) {
        return item?.toString();
    }
    style(i) {
        return this.index === i ? terminal_utils_1.term.inverse : terminal_utils_1.term.noFormat;
    }
    get index() {
        return this._index;
    }
    set index(value) {
        let oldIndex = this._index;
        //wraparound
        value = (this.list.length + value) % this.list.length;
        this._index = value;
        this.drawIndex(oldIndex);
        this.drawIndex(this.index);
        this.emit('hover', this.curItem, this.index);
    }
    up() {
        this.index--;
    }
    down() {
        this.index++;
    }
}
exports.List = List;
