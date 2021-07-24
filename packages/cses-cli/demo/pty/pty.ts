import {copySync, ensureDirSync, removeSync} from "fs-extra";
import {createShell, tempDir} from "./ptyOptions";
import * as path from "path";
import {homedir} from "os";
import {IDisposable} from "node-pty";
import * as execa from "execa";

export const speed = 1;

removeSync(tempDir);
ensureDirSync(tempDir);
const copyFolders = ['.config/fish', '.local/share/omf', '.local/share/fish',]
for (const folder of copyFolders) {
    copySync(path.join(homedir(), folder), path.join(tempDir, folder), {overwrite: false})
}
copySync(path.join(__dirname, '..'), tempDir)
removeSync(path.join(tempDir, "config.json"))
const castFile = path.join(__dirname, '../demo.cast')
const gifFile = path.join(__dirname, '../demo.gif')
const buf1 = Uint8Array.from([3]);
process.stdin.setRawMode(true)
process.stdin.on('data', data => {
    if (data.equals(buf1)) process.exit(0);
    pty.write(data.toString())
});


export const pty = createShell();

export async function init() {
    await setup(`asciinema rec --overwrite -q -c "clear && fish" ${castFile}`);
    await mirror();
    await wait("$")
}

export function cleanup() {
    pty.write('\x04');
    mirrorHandle.dispose();
    pty?.kill();
    process.stdin.pause();
    console.log();

}
export async function convert() {
    await execa.command(`asciicast2gif ${castFile} ${gifFile}`, {stdio: "inherit"})
}



export function wait(waitFor: string): Promise<void> {
    return new Promise(res => {
        const listener = pty.onData(data => {
            if (data.indexOf(waitFor) != -1) {
                listener.dispose();
                pause(75).then(res)
            }
        });
    });
}

let mirrorHandle: IDisposable;

export function mirror() {
    mirrorHandle = pty.onData(data => process.stdout.write(data));
}


export async function setup(message: string, waitFor: string | false = "$") {
    let waiter: Promise<void> = waitFor && wait(waitFor);
    pty.write(message + '\r')
    await waiter;
}

export async function execute(message: string, waitFor = "$") {
    let waiter = wait(waitFor);
    await slowType(message)
    await pause(80);
    await key('enter')
    await waiter;
    await pause(300);

}

//
//
//
//
export async function slowType(message: string, typeSpeed = 40) {
    for (const c of message) {
        pty.write(c)
        await pause(typeSpeed)
    }
}

const keys = {
    down: '\u001b[B',
    right: '\u001b[C',
    enter: '\r',
    EOF: '\x04'

}

export async function key(direction: keyof typeof keys) {
    pty.write(keys[direction])
    await pause(200);
}

export function pause(time: number): Promise<void> {
    return new Promise(res => setTimeout(res, time / speed));
}

