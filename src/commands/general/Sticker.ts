import { Message, decryptMedia } from "@open-wa/wa-automate";
import { DefineCommand } from "../../decorators/DefineCommand";
import BaseCommand from "../../libs/BaseCommand";

@DefineCommand("sticker", {
    aliases: ["stiker"],
    category: "general",
    cooldown: 20,
    description: {
        content: "Create sticker from a image or video, use *--crop* to make the sticker cropped.",
        usage: "[--crop]"
    }
})
export default class extends BaseCommand {
    public async exec(msg: Message, query: string[]): Promise<void> {
        const { flags } = this.parseArgs(query);
        const isCropped = flags.includes("crop");
        const isQuotedImage = msg.quotedMsg && msg.quotedMsg.type === "image";
        const isQuotedVideo = msg.quotedMsg && msg.quotedMsg.type === "video";
        if (msg.isMedia || msg.type === "image" || isQuotedImage) {
            const wait = await this.client.reply(msg.chatId as any, "*Please wait...*", msg.id as any);
            await this.create(msg, wait as string, isQuotedImage, false, isCropped);
        } else if (msg.type === "video" || isQuotedVideo) {
            if ((Number(msg.duration) || Number(msg.quotedMsg.duration)) >= 15) {
                await this.client.reply(msg.chatId as any, "Please use video/gif with duration under 15 seconds and try again.", msg.id as any);
                return undefined;
            }
            const wait = await this.client.reply(msg.chatId as any, "*Please wait...* sometime it takes longer than 3 minutes", msg.id as any);
            await this.create(msg, wait as string, isQuotedVideo, true, isCropped);
        } else {
            await this.client.sendText(msg.chatId as any, `Please send image/video/gif with *${this.handler!.prefix}sticker* caption or reply on the file!`);
        }
    }

    private async create(message: Message, waitMsg: string, isQuoted: boolean, isGif = false, crop = false): Promise<void> {
        try {
            const msg = isQuoted ? message.quotedMsg : message;
            const media = await decryptMedia(msg, this.client.config.UserAgent);
            const imageBase64 = `data:${msg.mimetype};base64,${media.toString("base64")}`;
            if (isGif) {
                await this.client.sendMp4AsSticker(message.chatId as any, media.toString("base64"), { crop }, { author: "Void", pack: "Created by" });
                await this.client.deleteMessage(message.chatId as any, waitMsg as any);
                return undefined;
            }
            await this.client.sendImageAsSticker(message.chatId as any, imageBase64, { keepScale: !crop, author: "Void", pack: "Created by" });
            await this.client.deleteMessage(message.chatId as any, waitMsg as any);
        } catch (e) {
            await this.client.deleteMessage(message.chatId as any, waitMsg as any);
            await this.client.sendText(message.chatId as any, `An error occured when trying to create the sticker. ${isGif ? "try again with shorter video/gif" : ""}`);
        }
    }
}
