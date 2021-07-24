import { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import { Rec, Tokens } from "./util";
export declare class Client {
    api: AxiosInstance;
    csrf: string;
    constructor(tokens?: Tokens);
    get<T = any>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>>;
    submit(url: string, data: Rec<any>): Promise<AxiosResponse<any>>;
    cacheGet(url: string): Promise<string>;
}
