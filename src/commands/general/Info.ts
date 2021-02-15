import { Message } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("info", {
    aliases: ["botinfo"],
    category: "general",
    description: {
        content: "Display bot information"
    }
})
export default class extends BaseCommand {
    public exec(msg: Message): void {
        void this.client.sendText(msg.chatId, "This bot was created by *Waxaranai#0606* with typescript and @open-wa/wa-automate. Give this project ⭐ at https://github.com/waxaranai/void");
    }
}
