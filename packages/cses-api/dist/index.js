"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("./client");
const util_1 = require("./util");
const cookie_1 = __importDefault(require("cookie"));
const cheerio_1 = __importDefault(require("cheerio"));
const dataset_json_1 = __importDefault(require("./dataset/dataset.json"));
const statusUrL = "/ajax/get_status.php?entry=";
class CSES {
    constructor(tokens) {
        this.client = new client_1.Client(tokens);
    }
    static async getUser(nick, pass) {
        let client = new client_1.Client();
        const { data, headers } = await client.get("/login");
        let cookies = cookie_1.default.parse(headers['set-cookie'].join(';'));
        let php = cookies['PHPSESSID'];
        let csrf = cheerio_1.default.load(data)('input[name="csrf_token"]').attr('value');
        client = new client_1.Client({ php, csrf });
        const reply = await client.submit('/login', { nick, pass });
        const accountPage = cheerio_1.default.load(reply.data);
        let accountNode = accountPage("a.account");
        if (accountNode.text() == "Login")
            return;
        return {
            name: accountNode.text(),
            id: accountNode.attr("href").split('/').pop(),
            php,
            csrf
        };
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
    async getStatus(id) {
        // const {id} = await this.getUser();
        const { data } = await this.client.get(`/user/${id}`);
        const html = cheerio_1.default.load(data);
        const table = html("table").first().find("td");
        let info = table.map((i, el) => cheerio_1.default(el).text());
        if (info[0] == "Name")
            info = info.slice(0, -2);
        const status = {};
        for (let i = 0; i < info.length; i += 2)
            status[info[i]] = info[i + 1];
        return status;
    }
    async forEachProblem(callback) {
        const { data } = await this.client.get('/problemset');
        let $root = cheerio_1.default.load(data);
        let sections = $root('h2', '.content').slice(1);
        let problemSet = {};
        for (let section of sections) {
            let $section = $root(section);
            let sectionTitle = $section.text();
            problemSet[sectionTitle] = [];
            let tasks = $section.next().children().toArray();
            for (const task of tasks) {
                let $task = $root(task);
                problemSet[sectionTitle].push(await callback($task));
            }
        }
        return problemSet;
    }
    async getStatusRecord() {
        return this.forEachProblem($task => {
            let $status = $task.find(".task-score");
            let status;
            if ($status.hasClass("zero")) {
                status = "zero";
            }
            else if ($status.hasClass("full")) {
                status = "full";
            }
            return status;
        });
    }
    async getProblemSet() {
        const statuses = await this.getStatusRecord();
        for (let section in dataset_json_1.default) {
            dataset_json_1.default[section].forEach((task, index) => task.status = statuses[section][index]);
        }
        return dataset_json_1.default;
    }
    async getProblemById(id) {
        for (let section in dataset_json_1.default) {
            for (const problem of dataset_json_1.default[section]) {
                if (problem.id === id)
                    return problem;
            }
        }
    }
    async getTestCases(id) {
        const task = await this.getProblemById(id);
        const tests = [];
        for (let i = 0; i < task.cases.length / 2; i++) {
            const data = await this.getTestCase(task, i);
            tests.push(data);
        }
        return tests;
    }
    async getTestCase(task, number) {
        let data = [task.cases[number * 2], task.cases[number * 2 + 1]].map(async (it) => (await this.client.cacheGet(`/file/${it}/2`)).toString());
        return [await data[0], await data[1]];
    }
    async submit(submitOptions) {
        const result = await this.client.submit('/course/send.php', submitOptions);
        const submit_id = util_1.extract(result.data, statusUrL, '"');
        if (util_1.isNumber(submit_id))
            return submit_id;
    }
    async getSubmitStatus(submit_id) {
        const { data } = await this.client.get(statusUrL + submit_id);
        if (data == "READY" || data == "COMPILE ERROR")
            return data;
        if (data == "PENDING")
            return 0;
        const percent = util_1.extract(data, "TESTING ", "%");
        return percent / 100;
    }
    async getSubmitResults(result_id) {
        const { data } = await this.client.get('problemset/result/' + result_id);
        const results = [];
        const $root = cheerio_1.default(data);
        let elements = cheerio_1.default($root.find("table").get()[1]).find(".verdict").get();
        const verdictStyles = {
            unknown: 'default',
            ac: 'green',
            wa: 'red',
            tle: 'purple',
            rte: 'orange',
            mle: 'yellow'
        };
        for (const element of elements) {
            const $element = cheerio_1.default(element);
            const color = Object.keys(verdictStyles).find(it => $element.hasClass(it));
            results.push({
                index: $element.prev().text(),
                verdict: $element.text(),
                time: $element.next().text(),
                verdictColor: verdictStyles[color]
            });
        }
        return results;
    }
}
exports.default = CSES;
__exportStar(require("./util"), exports);
