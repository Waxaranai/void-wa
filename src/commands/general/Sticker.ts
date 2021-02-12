import { Message, decryptMedia } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("sticker", {
    aliases: ["stiker"],
    category: "general",
    cooldown: 30,
    description: {
        content: "Create sticker from a image or video"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message): Promise<void> {
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isQuotedVideo = msg.quotedMsg && msg.quotedMsg.type === "video";
        if (msg.isMedia || msg.type === "image" || isQuotedImage) {
            const wait = await this.client.sendText(msg.chatId as any, "*Please wait...* sometime it takes longer than 3 minutes");
            await this.create(msg, isQuotedImage);
            await this.client.deleteMessage(msg.chatId as any, wait as any);
        } else if (msg.type === "video" || isQuotedVideo) {
            const wait = await this.client.sendText(msg.chatId as any, "*Please wait...* sometime it takes longer than 3 minutes");
            await this.create(msg, isQuotedVideo, true);
            await this.client.deleteMessage(msg.chatId as any, wait as any);
        } else {
            await this.client.sendText(msg.chatId as any, `Please send image/video/gif with *${this.handler!.prefix}sticker* caption or reply on the file!`);
        }
    }

    private async create(message: Message, isQuoted: boolean, isGif = false): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg : message;
            const media = await decryptMedia(msg, this.client.config.UserAgent);
            const imageBase64 = `data:${msg.mimetype};base64,${media.toString("base64")}`;
            if (isGif) {
                await this.client.sendMp4AsSticker(message.chatId as any, media.toString("base64"), { crop: false }, { author: "Void", pack: "Created by" });
                return undefined;
            }
            await this.client.sendImageAsSticker(message.chatId as any, imageBase64, { author: "Void", pack: "Created by" });
        } catch (e) {
            console.error(e);
            await this.client.sendText(message.chatId as any, "An error occured when trying to create the sticker.");
        }
    }
}
