import EventEmitter from "events";

import {BorderTexts, Box} from "./Box.js";
import {term} from "./terminal_utils.js";

const keys = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    ENTER: 'select',
    BACKSPACE: 'back'
}
type ValueOf<T> = T[keyof T];

type Names = {
    [k in ValueOf<typeof keys>]?: () => void
}


// @ts-ignore
export class Element extends EventEmitter implements Names {
    x: number
    y: number
    width: number
    height: number

    box: Box

    get l() {
        return this.x + 1;
    }


    get t() {
        return this.y + 1;
    }

    get h() {
        return this.width - 2;
    }

    get v() {
        return this.height - 2;
    }

    constructor(x, y, w, h) {
        super()
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        term.on('key', name => {
            let fixed = keys[name];
            if (typeof this[fixed] == 'function') this[fixed]();
        });
    }


    borders(borders?: BorderTexts) {
        if (!this.box) {
            this.box = new Box(this.x, this.y, this.width, this.height);
        } else {
            this.box.borders(borders)
        }
    }
}
