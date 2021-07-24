/// <reference types="node" />
import { ReadStream } from "fs";
export declare type Rec<T> = Record<string, T>;
export declare type Tokens = {
    php: string;
    csrf: string;
};
export declare type User = {
    id: string;
    name: string;
} & Tokens;
export declare type Status = 'zero' | 'full' | 'undefined';
export declare type ProblemOverview = {
    name: string;
    id: number;
    solves: number;
    attempts: number;
    details: {
        body: Rec<string>;
        limits: string[];
    };
    cases: string[];
    status?: Status;
};
export declare type ProblemSet = Rec<ProblemOverview[]>;
export declare type Result = {
    index: string;
    verdict: string;
    time: string;
    verdictColor: string;
};
export interface SubmitOptions {
    task: number;
    lang: string;
    option?: string;
    type: string;
    target: string;
    file: ReadStream;
}
export declare function extract(str: string, afterSubstring: string, beforeString: string): any;
export declare function extractLast(str: string, afterSubstring: string, beforeString: string): any;
export declare function isNumber(num: any): boolean;
