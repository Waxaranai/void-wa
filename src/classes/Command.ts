import type VoidClient from "./VoidClient";
import type CommandHandler from "./CommandHandler";
import type { CommandSchema } from "../interfaces";
import type { Message } from "whatsapp-web.js";

export default class Command implements CommandSchema {
    readonly handler: CommandHandler;
    public constructor(readonly client: VoidClient, readonly id: string, readonly description: CommandSchema["description"], readonly options: CommandSchema["options"]) {
        this.handler = this.client.commandHandler;
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public exec(msg: Message, args?: string[] | void): any { }
}