import { ev as event } from "@open-wa/wa-automate";
import { createLogger } from "../libs/Logger";
import { VoidServer } from "../libs/VoidServer";

export class QrHandler {
    public isAuthenticated = false;
    private readonly log = createLogger();
    public constructor(private readonly server: VoidServer) {
        event.on("qr.**", qrcode => this.sendQr(qrcode));
        event.on("**", (data, _, namespace) => {
            if ((data === "successfulScan" && namespace === "QR") || data === "SUCCESS") this.authenticated();
        });
    }

    private sendQr(qr: string): void {
        if (this.isAuthenticated || !this.server.ready || !this.server.socket) return undefined;
        this.log.info(`QRCode received, please scan it at http://localhost:${this.server.port}/`);
        this.server.socket.emit("qr", qr);
    }

    private authenticated(): boolean {
        this.log.info("Client authenticated!");
        this.isAuthenticated = true;
        return this.isAuthenticated;
    }
}
