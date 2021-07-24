import { Client } from "./client";
import { ProblemOverview, ProblemSet, Rec, Result, Status, SubmitOptions, Tokens, User } from "./util";
import { Cheerio, Element } from "cheerio";
export default class CSES {
    client: Client;
    constructor(tokens: Tokens);
    static getUser(nick: string, pass: string): Promise<User | undefined>;
    getStatus(id: string): Promise<{}>;
    forEachProblem<T>(callback: (task: Cheerio<Element>) => T | Promise<T>): Promise<Rec<T[]>>;
    getStatusRecord(): Promise<Rec<Status[]>>;
    getProblemSet(): Promise<ProblemSet>;
    getProblemById(id: number): Promise<ProblemOverview>;
    getTestCases(id: number): Promise<[string, string][]>;
    getTestCase(task: ProblemOverview, number: number): Promise<[string, string]>;
    submit(submitOptions: SubmitOptions): Promise<number | undefined>;
    getSubmitStatus(submit_id: number): Promise<number | "READY" | "COMPILE ERROR">;
    getSubmitResults(result_id: number): Promise<Result[]>;
}
export { ProblemOverview } from "./util";
export * from "./util";
