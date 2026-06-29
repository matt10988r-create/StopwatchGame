const http = require("http");
const fs = require("fs");
const path = require("path");
const WebSocket = require("ws");

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {

    let filePath;

    if (req.url === "/") {
        filePath = "display.html";
    } else {
        filePath = req.url.substring(1);
    }

    filePath = path.join(__dirname, filePath);

    fs.readFile(filePath, (err, data) => {

        if (err) {
            res.writeHead(404);
            res.end("File Not Found");
            return;
        }

        let type = "text/html";

        if (filePath.endsWith(".mp3"))
            type = "audio/mpeg";

        if (filePath.endsWith(".js"))
            type = "text/javascript";

        if (filePath.endsWith(".css"))
            type = "text/css";

        res.writeHead(200, {
            "Content-Type": type
        });

        res.end(data);

    });

});

const wss = new WebSocket.Server({ server });

wss.on("connection", ws => {

    ws.on("message", msg => {

        wss.clients.forEach(client => {

            if (client.readyState === WebSocket.OPEN) {
                client.send(msg.toString());
            }

        });

    });

});

server.listen(PORT, () => {
    console.log("Running on port " + PORT);
});