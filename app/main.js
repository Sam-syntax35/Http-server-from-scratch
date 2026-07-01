const net = require("net");

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();

    // First line: GET /user-agent HTTP/1.1
    const requestLine = request.split("\r\n")[0];
    const path = requestLine.split(" ")[1];

    if (path === "/user-agent") {
      const lines = request.split("\r\n");

      let userAgent = "";

      // Find the User-Agent header
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
    } else {
      socket.write(
        `HTTP/1.1 404 Not Found\r\n\r\n`
      );
    }

    socket.end();
  });
});

server.listen(4221, () => {
  console.log("Server listening on port 4221");
});