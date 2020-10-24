import type { Client, Message } from "@open-wa/wa-automate";
import BaseCommand from "../../libs/BaseCommand";

export default class InfoCommand extends BaseCommand {
    public constructor(public readonly client: Client) {
        super("info", {
            aliases: ["botinfo"],
            category: "general"
        }, {
            content: "Display bot information"
        });
    }

    public exec(msg: Message): void {
        void this.client.sendText(msg.chatId, "This bot was created by *Waxaranai#0606* with typescript and @open-wa/wa-automate. Give this project ⭐ at https://github.com/waxaranai/void");
    }
}
