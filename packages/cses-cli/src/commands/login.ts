import {program} from "commander";
import {config} from "../config";

import CSES from "cses-api"
import {askQuestion} from "../utils/terminal/Question";
import {term} from "../utils/terminal/terminal_utils";

program
    .command('login')
    .description('store cses username and password for login')
    .action(login);

async function login() {
    const username = await askQuestion("Username", config.user?.name)
    const password = await askQuestion("Password", null, false, true)
    config.user = await CSES.getUser(username, password);

    if (config.user?.id) {
        term.green(config.user.name)(' is signed in')
    } else {
        term.red("Log in failed")
    }
    await term('\n')
}


export async function ensureLoggedIn() {
    while (!config.user?.id) {
        await login()
    }

}
