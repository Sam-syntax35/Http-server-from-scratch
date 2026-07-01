const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const path = request.split(" ")[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
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
    } 
    else {
      socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
    }
  });

  socket.on("close", () => {
    socket.end();
  });
});

server.listen(4221, "localhost");