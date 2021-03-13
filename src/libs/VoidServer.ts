import http from "http";
import Void from "./Void";
import express from "express";
import { resolve } from "path";
import { createLogger } from "../utils/Logger";
import { Server as SocketServer, Socket } from "socket.io";
import { QrHandler } from "../handler/Qr";

export class VoidServer {
    public app = express();
    public httpServer = http.createServer(this.app);
    public socket: Socket | undefined;
    public ready = false;
    public readonly logger = createLogger();
    private readonly io = new SocketServer(this.httpServer);
    private readonly qrHandler = new QrHandler(this);
    public constructor(private readonly client: Void, public readonly port: number) {
        this.app.use("/style.css", express.static(resolve("src/public/style.css")));
        this.app.set("view engine", "html");
        this.io.on("connection", (socket: Socket) => {
            this.socket = socket;
            this.ready = true;
        });
        this.app.get("/qr", (_, response) => {
            if (this.qrHandler.isAuthenticated && this.socket) this.socket.emit("authenticated");
            return response.status(200).sendFile(resolve("src/public/index.html"));
        });
        this.app.get("*", (_, response) => response.redirect("/qr"));
        this.httpServer.listen(port, () => this.logger.info(`Listening to ${this.port}`));
    }
}
