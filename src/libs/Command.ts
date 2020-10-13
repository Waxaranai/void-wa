import type { Message } from "@open-wa/wa-automate";
import type { ICommand, ICommandDescription, ICommandOptions } from "../typings";

export default class Command implements ICommand {
    public constructor(public readonly id: string, public readonly options: ICommandOptions, public readonly description: ICommandDescription) { }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exec(msg: Message, args?: string[]): any {
        throw new Error("Exec Function must be declared");
    }
}
