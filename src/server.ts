import express from "express";
import http from "http";
import { existsSync } from "fs";
import { resolve } from "path";
import { Server as SocketServer, Socket } from "socket.io";

export default (port: number): void => {
    const app = express();
    const server = http.createServer(app);
    const io = new SocketServer(server);

    app.use("/style.css", express.static(resolve("src/public/style.css")));
    app.use("/qrcode.png", express.static(resolve("src/public/qrcode.png")));
    app.set("view engine", "html");


    io.on("connection", (socket: Socket) => {
        const authenticated = !existsSync("src/public/qrcode.png");
        if (authenticated) return socket.emit("authenticated");
        return socket.emit("qr");
    });
    app.get("/qr", (_, response) => response.status(200).sendFile(resolve("src/public/index.html")));
    app.get("*", (_, response) => response.redirect("/qr"));
    server.listen(port, () => console.log(`Listening to ${port}`));
};
