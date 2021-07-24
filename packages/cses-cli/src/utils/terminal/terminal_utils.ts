import {terminal} from "terminal-kit";
import {InputFieldOptions} from "terminal-kit/Terminal";

terminal.grabInput({});
export const term = terminal


export async function cursorLocation(): Promise<{ x: number, y: number }> {
    // @ts-ignore
    return term.getCursorLocation()
}



