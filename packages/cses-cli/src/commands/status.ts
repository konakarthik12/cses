import {program} from "commander";
import {config} from "../config";
import CSES from "cses-api"
import {ensureLoggedIn} from "./login";
import {term} from "../utils/terminal/terminal_utils";


program
    .command('status')
    .description('check cses profile status')
    .action(status);

async function status() {
    await ensureLoggedIn();
    const cses = new CSES(config.user);
    const status = await cses.getStatus(config.user.id);
    const tableData = Object.entries(status);
    for (const [key, value] of tableData) term.cyan(`${key}: `)(value)('\n')
}

