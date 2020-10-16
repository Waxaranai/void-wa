import VoidBot from "./libs/Void";
import config from "./config";
import server from "./server";
import { ev, QRFormat, QRQuality } from "@open-wa/wa-automate";
import { existsSync, mkdirSync, unlinkSync, writeFileSync } from "fs";

ev.on("authenticated.**", () => {
    console.log("Client authenticated! removing qrcode image.");
    if (existsSync("rc/public/qrcode.png")) unlinkSync("src/public/qrcode.png");
});
ev.on("qr.**", qrcode => {
    console.log(`QRCode received! You can scan it from the terminal or http://localhost:${config.port}/qr`);
    if (!existsSync("src/public")) mkdirSync("src/public");
    if (existsSync("src/public/qrcode.png")) unlinkSync("src/public/qrcode.png");
    writeFileSync("src/public/qrcode.png", Buffer.from(
        qrcode.replace("data:image/png;base64,", ""),
        "base64"
    ));
});
new VoidBot(config, {
    authTimeout: 0,
    autoRefresh: true,
    cacheEnabled: false,
    chromiumArgs: [
        "--no-sandbox",
        "--disable-setuid-sandbox",
        "--aggressive-cache-discard",
        "--disable-cache",
        "--disable-application-cache",
        "--disable-offline-load-stale-cache",
        "--disk-cache-size=0"
    ],
    disableSpins: true,
    headless: true,
    killProcessOnBrowserClose: true,
    qrFormat: QRFormat.PNG,
    qrLogSkip: true,
    qrQuality: QRQuality.EIGHT,
    qrRefreshS: 20,
    qrTimeout: 0,
    restartOnCrash: true,
    throwErrorOnTosBlock: false,
    useChrome: true
});

server(config.port);
