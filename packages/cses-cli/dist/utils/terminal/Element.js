"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Element = void 0;
const events_1 = __importDefault(require("events"));
const Box_1 = require("./Box");
const terminal_utils_1 = require("./terminal_utils");
const keys = {
    UP: 'up',
    DOWN: 'down',
    LEFT: 'left',
    RIGHT: 'right',
    ENTER: 'select',
    BACKSPACE: 'back'
};
// @ts-ignore
class Element extends events_1.default {
    constructor(x, y, w, h) {
        super();
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
        terminal_utils_1.term.on('key', name => {
            let fixed = keys[name];
            if (typeof this[fixed] == 'function')
                this[fixed]();
        });
    }
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
    borders(borders) {
        if (!this.box) {
            this.box = new Box_1.Box(this.x, this.y, this.width, this.height);
        }
        else {
            this.box.borders(borders);
        }
    }
}
exports.Element = Element;
