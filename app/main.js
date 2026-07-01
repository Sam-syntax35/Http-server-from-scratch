const net = require("net");
const fs = require("fs");
const pathModule = require("path");

const args = process.argv.slice(2);

let directory = null;

if (args[0] === "--directory") {
  directory = args[1];
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const path = request.split(" ")[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
      socket.end();
    } 
    else if (path.startsWith("/echo/")) {
      const message = path.substring(6);

      socket.write(
        `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${message.length}\r\n` +
        `\r\n` +
        message
      );

      socket.end();
    } 
    else if (path === "/user-agent") {
      const lines = request.split("\r\n");

      let userAgent = "";

      for (const line of lines) {
        if (line.startsWith("User-Agent:")) {
          userAgent = line.split(": ")[1];
          break;
        }
      }

      socket.write(
        `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${userAgent.length}\r\n` +
        `\r\n` +
        userAgent
      );

      socket.end();
    } 
    else if (path.startsWith("/files/")) {
      const filename = path.substring(7);
      const filePath = pathModule.join(directory, filename);

      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
        } else {
          socket.write(
            `HTTP/1.1 200 OK\r\n` +
            `Content-Type: application/octet-stream\r\n` +
            `Content-Length: ${fileData.length}\r\n` +
            `\r\n`
          );

          socket.write(fileData);
        }

        socket.end();
      });

      return;
    }
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
      socket.end();
    }
  });
});

server.listen(4221, "localhost");