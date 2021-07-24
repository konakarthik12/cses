import {Client} from "./client";
import {extract, isNumber, ProblemOverview, ProblemSet, Rec, Result, Status, SubmitOptions, Tokens, User} from "./util";
import cookie from "cookie";
import $, {Cheerio, Element} from "cheerio";

import problemSet from "./dataset/dataset.json";

const statusUrL = "/ajax/get_status.php?entry=";

export default class CSES {
    client: Client

    constructor(tokens: Tokens) {
        this.client = new Client(tokens);
    }

    static async getUser(nick: string, pass: string): Promise<User | undefined> {
        let client = new Client();
        const {data, headers} = await client.get("/login")

        let cookies = cookie.parse(headers['set-cookie'].join(';'));
        let php = cookies['PHPSESSID'];
        let csrf = $.load(data)('input[name="csrf_token"]').attr('value')
        client = new Client({php, csrf});

        const reply = await client.submit('/login', {nick, pass})

        const accountPage = $.load(reply.data);
        let accountNode = accountPage("a.account");

        if (accountNode.text() == "Login") return;
        return {
            name: accountNode.text(),
            id: accountNode.attr("href").split('/').pop(),
            php,
            csrf
        }
    }

    // async getUser() {
    //     const {data} = await this.client.get('/');
    //     const html = $.load(data);
    //     let accountNode = html("a.account");
    //     return {
    //         name: accountNode.text(),
    //         id: accountNode.attr("href").split('/').pop()
    //     }
    // }

    async getStatus(id: string) {
        // const {id} = await this.getUser();
        const {data} = await this.client.get(`/user/${id}`)
        const html = $.load(data);

        const table = html("table").first().find("td")

        let info = table.map((i, el) => $(el).text());
        if (info[0] == "Name") info = info.slice(0, -2)

        const status = {};
        for (let i = 0; i < info.length; i += 2) status[info[i]] = info[i + 1]
        return status;
    }

    async forEachProblem<T>(callback: (task: Cheerio<Element>) => T | Promise<T>): Promise<Rec<T[]>> {
        const {data} = await this.client.get('/problemset')
        let $root = $.load(data);
        let sections = $root('h2', '.content').slice(1);
        let problemSet: Rec<T[]> = {};
        for (let section of sections) {
            let $section = $root(section);
            let sectionTitle = $section.text();
            problemSet[sectionTitle] = [];
            let tasks = $section.next().children().toArray();
            for (const task of tasks) {
                let $task = $root(task);
                problemSet[sectionTitle].push(await callback($task))
            }
        }
        return problemSet;
    }

    async getStatusRecord(): Promise<Rec<Status[]>> {
        return this.forEachProblem($task => {
            let $status = $task.find(".task-score");

            let status: Status;
            if ($status.hasClass("zero")) {
                status = "zero"
            } else if ($status.hasClass("full")) {
                status = "full"
            }

            return status;
        })

    }

    async getProblemSet(): Promise<ProblemSet> {
        const statuses = await this.getStatusRecord()
        for (let section in problemSet) {
            problemSet[section].forEach((task, index) => task.status = statuses[section][index])
        }

        return problemSet;
    }

    async getProblemById(id: number): Promise<ProblemOverview> {
        for (let section in problemSet) {
            for (const problem of problemSet[section]) {
                if (problem.id === id) return problem;
            }
        }
    }

    async getTestCases(id: number): Promise<[string, string][]> {
        const task = await this.getProblemById(id)
        const tests: [string, string][] = [];
        for (let i = 0; i < task.cases.length / 2; i++) {
            const data = await this.getTestCase(task, i);
            tests.push(data)
        }
        return tests;
    }

    async getTestCase(task: ProblemOverview, number: number): Promise<[string, string]> {
        let data = [task.cases[number * 2], task.cases[number * 2 + 1]].map(async it => (await this.client.cacheGet(`/file/${it}/2`)).toString());
        return [await data[0], await data[1]];
    }


    async submit(submitOptions: SubmitOptions): Promise<number | undefined> {
        const result = await this.client.submit('/course/send.php', submitOptions);
        const submit_id = extract(result.data, statusUrL, '"')
        if (isNumber(submit_id)) return submit_id;
    }

    async getSubmitStatus(submit_id: number): Promise<number | "READY" | "COMPILE ERROR"> {
        const {data} = await this.client.get<string>(statusUrL + submit_id);
        if (data == "READY" || data == "COMPILE ERROR") return data;
        if(data=="PENDING") return 0;
        const percent = extract(data, "TESTING ", "%")
        return percent / 100;
    }

    async getSubmitResults(result_id: number): Promise<Result[]> {
        const {data} = await this.client.get<string>('problemset/result/' + result_id);
        const results: Result[] = [];
        const $root = $(data);
        let elements = $($root.find("table").get()[1]).find(".verdict").get();
        const verdictStyles = {
            unknown: 'default',
            ac: 'green',
            wa: 'red',
            tle: 'purple',
            rte: 'orange',
            mle: 'yellow'
        }
        for (const element of elements) {
            const $element = $(element)
            const color = Object.keys(verdictStyles).find(it => $element.hasClass(it))
            results.push({
                index: $element.prev().text(),
                verdict: $element.text(),
                time: $element.next().text(),
                verdictColor: verdictStyles[color]

            })
        }
        return results;
    }


}


export {ProblemOverview} from "./util"
export * from "./util"
