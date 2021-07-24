import {prompt} from "enquirer";

async function main() {
    const response = await prompt([
        {
            type: 'input',
            name: 'name',
            message: 'What is your name?'
        },
        {
            type: 'input',
            name: 'username',
            message: 'What is your username?'
        }
    ]);

    console.log(response);
}

main();
