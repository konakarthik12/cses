import execa from "execa";
import pandoc from "pandoc-binary";

export async function htmlToText(input: string): Promise<string> {

    input = input.replace(/<code>/g, "<br>").replace(/<\/code>/g, "<br>");
    const latex = await convert("html", "plain", "none", input);
    return await convert("latex", "plain", "preserve", latex);
}

async function convert(from, to, wrap, input) {
    return (await execa.command(`${pandoc} -f ${from} -t ${to} --wrap=${wrap}`, {input})).stdout
}
