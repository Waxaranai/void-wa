import { Message, decryptMedia } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("sticker", {
    aliases: ["stiker"],
    category: "general",
    cooldown: 30,
    description: {
        content: "Create sticker from a image. or get the image from a sticker",
        usage: "[--to-img]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isSticker = msg.quotedMsg && msg.quotedMsg.type === "sticker";
        if (msg.isMedia || isQuotedImage) {
            try {
                await this.create(msg, isQuotedImage);
            } catch (error) {
                await this.client.sendText(msg.chatId as any, "An error occured while trying to create the sticker!");
            }
        } else if (isSticker && flags.includes("to-img")) {
            try {
                await this.create(msg, true, true);
            } catch (error) {
                await this.client.sendText(msg.chatId as any, "An error occured while trying to convert the sticker!");
            }
        } else if (!isSticker && flags.includes("to-img")) {
            await this.client.sendText(msg.chatId as any, `Please reply a sticker with message *${this.handler!.prefix}sticker --to-img*`);
        } else {
            await this.client.sendText(msg.chatId as any, `Please send image with *${this.handler!.prefix}sticker* caption or reply on a image!`);
        }
    }

    private async create(message: Message, isQuoted: boolean, toImage = false): Promise<void> {
        const msg = isQuoted ? message.quotedMsg : message;
        const media = await decryptMedia(msg, this.client.config.UserAgent);
        const imageBase64 = `data:${msg.mimetype};base64,${media.toString("base64")}`;
        if (!toImage) {
            await this.client.sendImageAsSticker(message.chatId as any, imageBase64);
            return undefined;
        }
        await this.client.sendFile(message.chatId as any, imageBase64, "converted.png", "");
    }
}
