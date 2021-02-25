import "dotenv/config";
import VoidBot from "./libs/Void";
import config from "./config";
import { QRFormat, QRQuality } from "@open-wa/wa-automate";

new VoidBot(config, {
    authTimeout: 0,
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
    deleteSessionDataOnLogout: false,
    disableSpins: true,
    headless: true,
    killProcessOnBrowserClose: true,
    qrFormat: QRFormat.PNG,
    qrLogSkip: true,
    qrQuality: QRQuality.EIGHT,
    qrTimeout: 0,
    restartOnCrash: true,
    throwErrorOnTosBlock: false,
    useChrome: true
});
