import type VoidClient from "./VoidClient";
import type { CommandSchema } from "../interfaces";
import type { Message } from "whatsapp-web.js";

export default class Command implements CommandSchema {
    public constructor(readonly client: VoidClient, readonly id: string, readonly description: CommandSchema["description"], readonly options?: CommandSchema["options"]) { }
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function
    public exec(msg: Message, args?: string[] | void): any { }
}