import os from "os";
import path from "path";
import {spawn} from "node-pty";

export let tempDir = (path.join(os.tmpdir(), 'cses-demo-temp'));

export let ptyOptions = {
    shell: '/usr/bin/fish',
    name: 'xterm-256color',
    cols: process.stdout.columns,
    rows: process.stdout.rows,
    cwd: tempDir,
    env: {...process.env, "HOME": tempDir}
};

export function createShell() {
    return spawn(ptyOptions.shell, ["-P", "-C function fish_greeting; end"], ptyOptions);
}
