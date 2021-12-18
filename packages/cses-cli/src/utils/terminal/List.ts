import {Element} from "./Element.js";
import {BorderTexts} from "./Box.js";
import {term} from "./terminal_utils.js";
import {CTerminal} from "terminal-kit/Terminal";


export class List<K> extends Element {
    x: number;
    y: number;
    width: number;
    height: number;
    _index = 0;

    _list: K[];

    constructor(x, y, w, h) {

        super(x, y, w, h);

        let borders = this.borderTexts();
        if (borders) {
            this.borders(borders)
        }
    }

    get list(): K[] {
        return this._list;
    }

    set list(value) {
        this._list = value;
        this.draw();
    }


    get curItem() {
        return this.list[this._index]
    }

    borderTexts(): Partial<BorderTexts> {
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
        term.eraseArea(this.l, this.t, this.h, this.v)
        for (let i = 0; i < this.list.length; i++) {
            this.drawIndex(i);
        }
    }

    drawIndex(i: number) {
        term.moveTo(this.l, this.t + i);

        this.style(i)(this.text(this.list[i]));
    }

    text(item: K) {
        return item?.toString();
    }

    style(i: number): CTerminal {
        return this.index === i ? term.inverse : term.noFormat
    }

    get index() {
        return this._index;
    }

    set index(value) {
        let oldIndex = this._index;
        //wraparound
        value = (this.list.length + value) % this.list.length;
        this._index = value;
        this.drawIndex(oldIndex)
        this.drawIndex(this.index)
        this.emit('hover', this.curItem, this.index)
    }

    up() {
        this.index--
    }

    down() {
        this.index++
    }


}
