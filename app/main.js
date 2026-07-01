const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const path = data.toString().split(" ")[1];

    if (path === "/") {
      socket.write("HTTP/1.1 200 OK\r\n\r\n");
    } 
    else if (path.startsWith("/echo/")) {
      const message = path.substring(6); // Extract text after "/echo/"

      socket.write(
        `HTTP/1.1 200 OK\r\n` +
        `Content-Type: text/plain\r\n` +
        `Content-Length: ${message.length}\r\n` +
        `\r\n` +
        `${message}`
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