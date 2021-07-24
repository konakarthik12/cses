import {term} from "./terminal_utils";
import {box} from "../symbols";

export function drawBox(x: number, y: number, width: number, height: number, title = '', right = '') {
    const x1 = x;
    const y1 = y;
    const x2 = x + width - 1;
    const y2 = y + height - 1;
    term.moveTo(x1, y1)
    term(box.topLeft)
    for (let i = x1 + 1; i < x2; i++) term(box.top)
    term(box.topRight)
    for (let i = y1 + 1; i < y2; i++) {
        term.moveTo(x1, i)
        term(box.left)
        term.moveTo(x2, i)
        term(box.right)
    }
    term.moveTo(x1, y2)
    term(box.bottomLeft)
    for (let i = x1 + 1; i < x2; i++) term(box.bottom)
    term(box.bottomRight)
    if (title) {
        term.moveTo(x1 + 2, y1)
        term(title)
    }
    if (right) {
        term.moveTo(x2 - right.length - 1, y1)
        term(right)
    }
    term.moveTo(x + 1, y + 1)

}

export type BorderTexts = Partial<{
    topLeft: string
    topRight: string
    bottomLeft: string
    bottomRight: string
}>

export class Box {
    private readonly x: number;
    private readonly y: number;
    private readonly w: number;
    private readonly h: number;
    private lText: string='';
    private rText: string='';


    constructor(x: number, y: number, w: number, h: number, borders?: BorderTexts) {
        this.x = x;
        this.y = y;
        this.w = w;
        this.h = h;
        drawBox(x, y, w, h)
        this.borders(borders)
    }

    set left(value: string) {
        if (value == this.lText) return;

        value ||= '';
        let left = value.padEnd(this.lText.length, box.top);
        this.lText = value;
        term.moveTo(this.x + 2, this.y)(left)
    }

    set right(value: string) {
        if (value == this.rText) return;
        value ||= '';
        let right = value.padStart(this.rText.length, box.top);
        this.rText = value;
        term.moveTo(this.x + this.w - right.length - 2, this.y)(right)
    }

    borders(borders?: BorderTexts) {
        this.left = borders?.topLeft;
        this.right= borders?.topRight;
    }
}
