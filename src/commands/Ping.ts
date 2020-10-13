import type { Client, Message } from "@open-wa/wa-automate";
import Command from "../libs/Command";

export default class PingCommand extends Command {
    public constructor(public readonly client: Client) {
        super("ping", {
            aliases: [],
            category: "general"
        }, {
            content: "Ping pong!"
        });
    }

    public exec(msg: Message): void {
        void this.client.sendText(msg.from, "Pong!");
    }
}
