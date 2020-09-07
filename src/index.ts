import VoidClient from "./classes/VoidClient";
import { resumeSession, sessionPath } from "./config";
import { existsSync } from "fs";
import type { ClientSession } from "whatsapp-web.js";

let sessionData: ClientSession | undefined;
if (existsSync(sessionPath) && resumeSession) {
    sessionData = require(sessionPath);
    if (!sessionData!.WABrowserId || !sessionData!.WASecretBundle || !sessionData!.WAToken1 || !sessionData!.WAToken2) sessionData = undefined;
}

new VoidClient({ session: sessionData!, puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox", "--unhandled-rejections=strict"] } }).setup();