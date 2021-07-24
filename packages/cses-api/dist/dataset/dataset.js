"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const tokens = __importStar(require("./tokens.json"));
const fs_extra_1 = require("fs-extra");
const cheerio_1 = __importDefault(require("cheerio"));
const index_1 = __importStar(require("../index"));
const pandoc_1 = require("./pandoc");
let count = 0;
const cses = new index_1.default(tokens);
async function getProblemSet() {
    return await cses.forEachProblem(async ($task) => {
        let $link = $task.find('a');
        let $detail = $task.find(".detail");
        let id = +$link.attr().href.split('/').pop();
        let name = $link.text();
        let [solves, attempts] = $detail.text().split('/').map(i => +i);
        let details = await getTaskDetails(id);
        let cases = await getCases(id);
        console.log(++count + " problems loaded");
        return { id, name, solves, attempts, details, cases };
    });
}
async function getTaskDetails(problemId) {
    let data = await cses.client.cacheGet("/problemset/task/" + problemId);
    const $root = cheerio_1.default.load(data);
    const $content = $root(".content");
    let $constraints = $content.find(".task-constraints");
    const limits = $constraints.find("li").map((i, el) => cheerio_1.default(el).contents().last().text().trim()).toArray();
    let nodes = $content.contents().toArray();
    // @ts-ignore
    const sliceStart = nodes.findIndex(it => it.name == "ul") + 1;
    let key = "Description";
    const body = {};
    for (const elem of nodes.slice(sliceStart)) {
        let $elem = cheerio_1.default(elem);
        if (!$elem.text().trim())
            continue;
        // @ts-ignore
        if (elem.name === "b") {
            key = $elem.text().trim();
        }
        else {
            let data = cheerio_1.default.html(elem) || $elem.text();
            body[key] || (body[key] = "");
            body[key] += data;
        }
    }
    const details = { limits, body };
    for (const key in details.body) {
        details.body[key] = await pandoc_1.htmlToText(details.body[key]);
    }
    return details;
}
async function getCases(problemId) {
    const problem_data = await cses.client.cacheGet(`/problemset/task/${problemId}`);
    const result_id = index_1.extractLast(problem_data, "/result/", "/");
    const results_data = await cses.client.cacheGet(`/problemset/result/${result_id}`);
    const $root = cheerio_1.default.load(results_data);
    let testId = 1;
    const empty_file = '/file/0000000000000000000000000000000000000000000000000000000000000000/0/2';
    const test_urls = [];
    while (true) {
        const $title = $root("#test" + testId);
        if ($title.length === 0)
            break;
        const $input_table = $title.next().next();
        const $answer_table = $input_table.next().next();
        const input_url = $input_table.find("a.save").attr("href") ?? empty_file;
        const answer_url = $answer_table.find("a.save").attr("href") ?? empty_file;
        test_urls.push(input_url, answer_url);
        testId++;
    }
    let testData = [];
    const start = '/file/'.length;
    for (const testFile of test_urls) {
        const hash = testFile.substr(start, 66);
        testData.push(hash);
    }
    console.assert(testData.length % 2 == 0);
    return testData;
}
async function main() {
    const problemSet = await getProblemSet();
    await fs_extra_1.writeJSON('dataset.json', problemSet);
}
main();
