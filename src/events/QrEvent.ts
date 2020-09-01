/* eslint-disable @typescript-eslint/no-misused-promises */
import { toDataURL } from "qrcode";
import type { EventSchema } from "../interfaces";
import type VoidClient from "../classes/VoidClient";

export default class QrEvent implements EventSchema {
    readonly name = "qr";
    public constructor(readonly client: VoidClient) { }
    public exec(qr: string): void {
        this.client.http.get("/", async (_, response) => {
            if (this.client.info) return response.status(401).send("<center><h1>Already logged in.</h1></center>");
            const code = await toDataURL(qr);
            const body = `<center><img src='${code}' alt="code"></img><br/>Scan this QRCode with Whatsapp on your phone!</center>`;
            return response.status(200).send(body);
        });
    }
}