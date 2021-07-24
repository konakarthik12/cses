"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Box = exports.drawBox = void 0;
const terminal_utils_1 = require("./terminal_utils");
const symbols_1 = require("../symbols");
function drawBox(x, y, width, height, title = '', right = '') {
    const x1 = x;
    const y1 = y;
    const x2 = x + width - 1;
    const y2 = y + height - 1;
    terminal_utils_1.term.moveTo(x1, y1);
    terminal_utils_1.term(symbols_1.box.topLeft);
    for (let i = x1 + 1; i < x2; i++)
        terminal_utils_1.term(symbols_1.box.top);
    terminal_utils_1.term(symbols_1.box.topRight);
    for (let i = y1 + 1; i < y2; i++) {
        terminal_utils_1.term.moveTo(x1, i);
        terminal_utils_1.term(symbols_1.box.left);
        terminal_utils_1.term.moveTo(x2, i);
        terminal_utils_1.term(symbols_1.box.right);
    }
    terminal_utils_1.term.moveTo(x1, y2);
    terminal_utils_1.term(symbols_1.box.bottomLeft);
    for (let i = x1 + 1; i < x2; i++)
        terminal_utils_1.term(symbols_1.box.bottom);
    terminal_utils_1.term(symbols_1.box.bottomRight);
    if (title) {
        terminal_utils_1.term.moveTo(x1 + 2, y1);
        terminal_utils_1.term(title);
    }
    if (right) {
        terminal_utils_1.term.moveTo(x2 - right.length - 1, y1);
        terminal_utils_1.term(right);
    }
    terminal_utils_1.term.moveTo(x + 1, y + 1);
}
exports.drawBox = drawBox;
class Box {
    constructor(x, y, w, h, borders) {
        this.lText = '';
        this.rText = '';
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        drawBox(x, y, w, h);
        this.borders(borders);
    }
    set left(value) {
        if (value == this.lText)
            return;
        value || (value = '');
        let left = value.padEnd(this.lText.length, symbols_1.box.top);
        this.lText = value;
        terminal_utils_1.term.moveTo(this.x + 2, this.y)(left);
    }
    set right(value) {
        if (value == this.rText)
            return;
        value || (value = '');
        let right = value.padStart(this.rText.length, symbols_1.box.top);
        this.rText = value;
        terminal_utils_1.term.moveTo(this.x + this.w - right.length - 2, this.y)(right);
    }
    borders(borders) {
        this.left = borders?.topLeft;
        this.right = borders?.topRight;
    }
}
exports.Box = Box;
