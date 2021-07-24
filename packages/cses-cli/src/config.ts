import {mkdirsSync, readJsonSync, writeJsonSync} from "fs-extra";
import path from "path";
import {homedir} from "os";
import {User} from "cses-api";

let configPath = path.join(homedir(), '.config/cses/config.json');
mkdirsSync(path.dirname(configPath))

interface Config {

    commands: Partial<{ compile: string, run: string }>
    settings: Partial<{
        lang: string;
        option: string;
        file: string;
    }>
    selected: number;
    user: User

}

let target: Partial<Config> = {};
try {
    target = readJsonSync(configPath)
} catch (e) {
}

export const proxy: ProxyHandler<Config> = {
    get: function (target: Config, p: string | symbol) {
        return target[p];
    },
    set(target: Config, p: string | symbol, value: any): boolean {
        target[p] = value;
        writeJsonSync(configPath, target);
        return true;
    },
    deleteProperty(target: Config, p: string | symbol): boolean {
        delete target[p];
        writeJsonSync(configPath, target);
        return true;
    }

};
process.on("exit", () => writeJsonSync(configPath, target))

export const config: Partial<Config> = new Proxy(target, proxy);

