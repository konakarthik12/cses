"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Client = void 0;
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const cookie_1 = __importDefault(require("cookie"));
const path_1 = __importDefault(require("path"));
const fs_extra_1 = require("fs-extra");
axios_1.default.defaults.baseURL = 'https://cses.fi';
class Client {
    constructor(tokens) {
        this.csrf = tokens?.csrf;
        let Cookie = tokens?.php ? cookie_1.default.serialize('PHPSESSID', tokens?.php) : '';
        this.api = axios_1.default.create({ headers: { Cookie } });
    }
    get(url, config) {
        return this.api.get(url, config);
    }
    submit(url, data) {
        const form = new form_data_1.default();
        Object.entries(data).forEach(([key, value]) => form.append(key, value));
        form.append('csrf_token', this.csrf);
        return this.api.post(url, form, { headers: form.getHeaders() });
    }
    async cacheGet(url) {
        let filePath = path_1.default.join(__dirname, '../cache', url + ".cache");
        if ((0, fs_extra_1.existsSync)(filePath)) {
            return (0, fs_extra_1.readFile)(filePath, 'utf8');
        }
        else {
            await (0, fs_extra_1.mkdirs)(path_1.default.dirname(filePath));
            const response = (await this.get(url));
            // response
            await (0, fs_extra_1.writeFile)(filePath, response.data.toString(), 'utf8');
            return response.data;
        }
    }
}
exports.Client = Client;
