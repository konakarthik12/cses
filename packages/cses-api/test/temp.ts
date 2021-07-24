import CSES from "../src";

async function main() {
    const cses = new CSES(require('./config.json'));
    const problemSet = await cses.getProblemSet();
    console.log(problemSet)
}

//
//
main()
//
