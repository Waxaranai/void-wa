import express from "express";
import http from "http";
import socket from "socket.io";
import { existsSync } from "fs";
import { resolve } from "path";

export default (port: number): void => {
    const app = express();
    const server = http.createServer(app);
    const io = socket(server);

    app.use("/style.css", express.static(resolve("src/public/style.css")));
    app.use("/qrcode.png", express.static(resolve("src/public/qrcode.png")));
    app.set("view engine", "html");

    const authenticated = !existsSync("src/public/qrcode.png");

    io.on("connection", socket => {
        if (authenticated) socket.emit("authenticated");
        else socket.emit("qr");
    });
    app.get("/qr", (_, response) => response.status(200).sendFile(resolve("src/public/index.html")));
    app.get("*", (_, response) => response.redirect("/qr"));
    server.listen(port, () => console.log(`Listening to ${port}`));
};
