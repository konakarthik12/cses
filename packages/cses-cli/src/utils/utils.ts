import {fileURLToPath} from 'node:url';
import path from 'node:path';

const commonJsModule = require("fs-extra")

export const {mkdirp} = commonJsModule
export const {readJsonSync} = commonJsModule
export const {writeJsonSync} = commonJsModule
export const {mkdirsSync} = commonJsModule

export function dirname(base, ...paths) {
    return path.join(path.dirname(fileURLToPath(base)), ...paths);
}

export function sleep(time: number): Promise<void> {
    return new Promise(res => setTimeout(res, time));

}
