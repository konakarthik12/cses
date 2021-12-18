import path from "path";
import {homedir} from "os";
import {User} from "cses-api";
import {mkdirsSync, readJsonSync, writeJsonSync} from "./utils/utils.js";

let configPath = path.join(homedir(), '.config/cses/config.json');
mkdirsSync(path.dirname(configPath))
process.on("exit", () => {
    writeJsonSync(configPath, target);
})
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
        process.exit();
        return false;
    },
    deleteProperty(target: Config, p: string | symbol): boolean {
        delete target[p];
        writeJsonSync(configPath, target);
        return true;
    }

};


export const config: Partial<Config> = new Proxy(target, proxy);

