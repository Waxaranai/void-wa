import Command from "../../classes/Command";
import { launch } from "puppeteer";
import assets from "../../assets/json/cooltext.json";
import { Message, MessageMedia } from "whatsapp-web.js";
import type VoidClient from "../../classes/VoidClient";

export default class CoolTextCommand extends Command {
    public constructor(readonly client: VoidClient) {
        super(client, "cooltext", { content: "Generate random cooltext image." }, { category: "general", aliases: [], cooldown: 15000 });
    }
    public async exec(msg: Message, args: string[]): Promise<void> {
        if (!args.length) return undefined;
        const browser = await launch({ headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--unhandled-rejections=strict"] });
        try {
            const page = await browser.newPage();
            await page.goto(this.link);
            await page.keyboard.type(args.join(" "));
            await page.waitFor(5000);
            const img = await page.$eval("img#PreviewImage", e => e.getAttribute("src")) as string;
            await browser.close();
            const { body: data }: { body: Buffer } = await this.client.request.get(img);
            const media = new MessageMedia("image/png", data.toString("base64"), "cooltext.png");
            await msg.reply(media, msg.from, { caption: `${args.join(" ")}` });
        } catch (error) {
            console.log(error);
        }
    }
    private get link(): string {
        return assets[Math.floor(Math.random() * assets.length)];
    }
}