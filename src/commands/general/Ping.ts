/* eslint-disable no-negated-condition */
import { Client, Message } from "@open-wa/wa-automate";
import BaseCommand from "../../libs/BaseCommand";

export default class PingCommand extends BaseCommand {
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
        else await this.client.sendText(msg.chatId as any, "Pong");
    }
}
