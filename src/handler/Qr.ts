import { ev as event } from "@open-wa/wa-automate";
import { VoidServer } from "../libs/VoidServer";

export class QrHandler {
    public isAuthenticated = false;
    public constructor(private readonly server: VoidServer) {
        event.on("qr.**", qrcode => this.sendQr(qrcode));
        event.on("**", (data, _, namespace) => {
            if ((data === "successfulScan" && namespace === "QR") || data === "SUCCESS") this.authenticated();
        });
    }

    private sendQr(qr: string): void {
        if (this.isAuthenticated || !this.server.ready || !this.server.socket) return undefined;
        this.server.logger.info(`QRCode received, please scan it at http://localhost:${this.server.port}/`);
        this.server.socket.emit("qr", qr);
    }

    private authenticated(): boolean {
        this.server.logger.info("Client authenticated!");
        this.isAuthenticated = true;
        return this.isAuthenticated;
    }
}
