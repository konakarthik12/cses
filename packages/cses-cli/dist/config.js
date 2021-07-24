"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = exports.proxy = void 0;
const fs_extra_1 = require("fs-extra");
const path_1 = __importDefault(require("path"));
const os_1 = require("os");
let configPath = path_1.default.join(os_1.homedir(), '.config/cses/config.json');
fs_extra_1.mkdirsSync(path_1.default.dirname(configPath));
let target = {};
try {
    target = fs_extra_1.readJsonSync(configPath);
}
catch (e) {
}
exports.proxy = {
    get: function (target, p) {
        return target[p];
    },
    set(target, p, value) {
        target[p] = value;
        fs_extra_1.writeJsonSync(configPath, target);
        return true;
    },
    deleteProperty(target, p) {
        delete target[p];
        fs_extra_1.writeJsonSync(configPath, target);
        return true;
    }
};
process.on("exit", () => fs_extra_1.writeJsonSync(configPath, target));
exports.config = new Proxy(target, exports.proxy);
