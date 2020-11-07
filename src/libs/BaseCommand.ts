import MessageHandler from "../handler/Message";
import { Client, Message } from "@open-wa/wa-automate";
import { ICommand, ICommandDescription, ICommandOptions, IParsedArgs } from "../typings";

export default class BaseCommand implements ICommand {
    public path = __dirname;
    public handler: MessageHandler | undefined;
    public client: Client | undefined;
    public constructor(public readonly id: string, public readonly options: ICommandOptions, public readonly description: ICommandDescription) {
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    public exec(msg: Message, args?: string[]): any {
        throw new Error("Exec Function must be declared");
    }

    public parseArgs(query: string[]): IParsedArgs {
        const args: string[] = [];
        const flags: string[] = [];
        for (const str of query) {
            if (str.startsWith("--") && str.slice(2).length > 0) flags.push(str.slice(2));
            else args.push(str);
        }
        return { args, flags };
    }
}
