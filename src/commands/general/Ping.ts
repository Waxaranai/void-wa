/* eslint-disable no-negated-condition */
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

    public async exec(msg: Message): Promise<any> {
        if (!msg.fromMe) await this.client.sendText(msg.from, "Pong!");
        else await this.client.sendText(msg.chatId, "Pong");
    }
}
