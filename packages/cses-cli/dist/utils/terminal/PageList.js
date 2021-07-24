"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PageList = void 0;
const List_1 = require("./List");
class PageList extends List_1.List {
    constructor() {
        super(...arguments);
        this._sliceStart = 0;
    }
    get list() {
        return super.list.slice(this.sliceStart, this.sliceEnd);
    }
    set list(value) {
        super.list = value;
    }
    get index() {
        return super.index;
    }
    set index(value) {
        value += this.sliceStart;
        if (value >= super.list.length) {
            this.home();
        }
        else if (value < 0) {
            this.end();
        }
        else {
            if (value < this.sliceStart)
                this.sliceStart--;
            else if (value >= this.sliceEnd)
                this.sliceStart++;
            else {
                super.index = value - this.sliceStart;
            }
        }
    }
    home() {
        this.sliceStart = 0;
        super.index = 0;
    }
    end() {
        this.sliceEnd = super.list.length;
        super.index = this.viewHeight - 1;
    }
    get viewHeight() {
        return Math.min(this.v, super.list.length);
    }
    get sliceStart() {
        return this._sliceStart;
    }
    set sliceStart(value) {
        this._sliceStart = value;
        this.draw();
    }
    get sliceEnd() {
        return this.sliceStart + this.viewHeight;
    }
    set sliceEnd(value) {
        this.sliceStart = value - this.viewHeight;
    }
}
exports.PageList = PageList;
