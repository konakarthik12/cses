import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";
import FormData from "form-data";
import {Rec, Tokens} from "./util";
import cookie from "cookie";
import path from "path";
import {existsSync, mkdirs, readFile, writeFile} from "fs-extra";

axios.defaults.baseURL = 'https://cses.fi';

export class Client {
    api: AxiosInstance
    csrf: string

    constructor(tokens?: Tokens) {
        this.csrf = tokens?.csrf;
        let Cookie = tokens?.php ? cookie.serialize('PHPSESSID', tokens?.php) : '';
        this.api = axios.create({headers: {Cookie}});
    }

    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
        return this.api.get(url, config)
    }

    submit(url: string, data: Rec<any>) {
        const form = new FormData();
        Object.entries(data).forEach(([key, value]) => form.append(key, value))
        form.append('csrf_token', this.csrf)
        return this.api.post(url, form, {headers: form.getHeaders()})
    }

    async cacheGet(url: string): Promise<string> {
        let filePath = path.join(__dirname, '../cache', url + ".cache");
        if (existsSync(filePath)) {
            return readFile(filePath, 'utf8')
        } else {
            await mkdirs(path.dirname(filePath));
            const response = (await this.get(url));
            // response
            await writeFile(filePath, response.data.toString(), 'utf8');
            return response.data;
        }
    }


}



