/* eslint-disable no-negated-condition */
import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("ping", {
    aliases: [],
    category: "general",
    description: {
        content: "Ping pong!"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message): Promise<any> {
        if (!msg.fromMe) await this.client.reply(msg.from, "Pong!", msg.id);
        else await this.client.reply(msg.chatId, "Pong", msg.id);
    }
}
