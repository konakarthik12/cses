import * as tokens from "./tokens.json";
import {writeJSON} from "fs-extra";
import $ from "cheerio";
import CSES, {extractLast, ProblemSet, Rec} from "../index.js";
import {htmlToText} from "./pandoc";
import {join} from "path";

let count = 0;
const cses = new CSES(tokens);

async function getProblemSet(): Promise<ProblemSet> {
    return await cses.forEachProblem(async $task => {
        let $link = $task.find('a');
        let $detail = $task.find(".detail");
        let id = +$link.attr().href.split('/').pop();
        let name = $link.text();
        let [solves, attempts] = $detail.text().split('/').map(i => +i);
        let details = await getTaskDetails(id);
        let cases = await getCases(id);
        console.log(++count + " problems loaded");
        return {id, name, solves, attempts, details, cases}

    });

}

async function getTaskDetails(problemId: number) {
    let data: string = await cses.client.cacheGet("/problemset/task/" + problemId);
    const $root = $.load(data);
    const $content = $root(".content");

    let $constraints = $content.find(".task-constraints");

    const limits = $constraints.find("li").map((i, el) => $(el).contents().last().text().trim()).toArray()
    let nodes = $content.contents().toArray()
    // @ts-ignore
    const sliceStart = nodes.findIndex(it => it.name == "ul") + 1;
    let key = "Description"
    const body: Rec<string> = {}

    for (const elem of nodes.slice(sliceStart)) {
        let $elem = $(elem)
        if (!$elem.text().trim()) continue;
        // @ts-ignore
        if (elem.name === "b") {
            key = $elem.text().trim()
        } else {
            let data = $.html(elem) || $elem.text();
            body[key] ||= "";
            body[key] += data;
        }
    }
    const details = {limits, body}

    for (const key in details.body) {
        details.body[key] = await htmlToText(details.body[key])
    }
    return details;
}


async function getCases(problemId: number) {

    const problem_data = await cses.client.cacheGet(`/problemset/task/${problemId}`)
    const result_id = extractLast(problem_data, "/result/", "/")
    const results_data = await cses.client.cacheGet(`/problemset/result/${result_id}`)
    const $root = $.load(results_data)
    let testId = 1;
    const empty_file = '/file/0000000000000000000000000000000000000000000000000000000000000000/0/2'
    const test_urls = []
    while (true) {
        const $title = $root("#test" + testId);
        if ($title.length === 0) break;
        const $input_table = $title.next().next();
        const $answer_table = $input_table.next().next();
        const input_url = $input_table.find("a.save").attr("href") ?? empty_file
        const answer_url = $answer_table.find("a.save").attr("href") ?? empty_file
        test_urls.push(input_url, answer_url)
        testId++;
    }
    let testData = [];
    const start = '/file/'.length;
    for (const testFile of test_urls) {
        const hash = testFile.substr(start, 66);
        testData.push(hash)
    }
    console.assert(testData.length % 2 == 0)
    return testData;

}


async function main() {
    const problemSet = await getProblemSet();
    let filePath = join(__dirname, 'dataset.json');
    await writeJSON(filePath, problemSet)
}

main();




