import {ReadStream} from "fs";
import { createRequire } from "module";

export type Rec<T> = Record<string, T>
export type Tokens = { php: string, csrf: string }
export type User = { id: string, name: string, } & Tokens
export type Status = 'zero' | 'full' | 'undefined'
export type ProblemOverview = { name: string, id: number, solves: number, attempts: number, details: { body: Rec<string>, limits: string[] }, cases: string[], status?: Status }
export type ProblemSet = Rec<ProblemOverview[]>;
export type Result = { index: string, verdict: string, time: string, verdictColor: string }

export interface SubmitOptions {
    task: number, //1068
    lang: string, //C++
    option?: string //C++17
    type: string, //course
    target: string //problemset
    file: ReadStream //fs.createReadStream('input.cpp')
}

export function extract(str: string, afterSubstring: string, beforeString: string): any {
    let start = str.indexOf(afterSubstring) + afterSubstring.length
    if (start === -1) throw `Can't find ${afterSubstring} in ${str}`

    let end = str.indexOf(beforeString, start)
    if (end === -1) throw `Can't find ${beforeString} in ${str}`

    return str.slice(start, end)

}

export function extractLast(str: string, afterSubstring: string, beforeString: string): any {
    let start = str.lastIndexOf(afterSubstring) + afterSubstring.length
    if (start === -1) throw `Can't find ${afterSubstring} in ${str}`

    let end = str.indexOf(beforeString, start)
    if (end === -1) throw `Can't find ${beforeString} in ${str}`

    return str.slice(start, end)
}


export function isNumber(num: any) {
    return num == +num;
}
const require = createRequire(import.meta.url)
const commonJsModule = require("fs-extra")
import {fileURLToPath} from 'url';
import path from 'path';

export function dirname(base, ...paths) {
    return path.join(path.dirname(fileURLToPath(base)), ...paths);
}

export const {mkdirs} = commonJsModule
export const {readFile} = commonJsModule
export const {writeFile} = commonJsModule
export const {readJsonSync} = commonJsModule

