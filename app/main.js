// const net = require("net");
// const fs = require("fs");
// const pathModule = require("path");
// const zlib = require("zlib");

// const args = process.argv.slice(2);

// let directory = null;

// if (args[0] === "--directory") {
//   directory = args[1];
// }

// const server = net.createServer((socket) => {
//   socket.on("data", (data) => {
//     const request = data.toString();
//     const lines = request.split("\r\n");

// let acceptEncoding = "";

// for (const line of lines) {
//   if (line.startsWith("Accept-Encoding:")) {
//     acceptEncoding = line.split(":")[1].trim();
//   }
// }

//     const method = request.split(" ")[0];
//     const path = request.split(" ")[1];

//     // GET /
//     if (path === "/") {
//       socket.write("HTTP/1.1 200 OK\r\n\r\n");
//       socket.end();
//     }


// // GET /echo/{message}
// else if (path.startsWith("/echo/")) {
//   const message = path.substring(6);

//   if (acceptEncoding.includes("gzip")) {
//     const compressed = zlib.gzipSync(message);

//     const headers =
//       `HTTP/1.1 200 OK\r\n` +
//       `Content-Type: text/plain\r\n` +
//       `Content-Encoding: gzip\r\n` +
//       `Content-Length: ${compressed.length}\r\n` +
//       `\r\n`;

//     socket.write(headers);
//     socket.write(compressed);
//   } else {
//     const headers =
//       `HTTP/1.1 200 OK\r\n` +
//       `Content-Type: text/plain\r\n` +
//       `Content-Length: ${message.length}\r\n` +
//       `\r\n`;

//     socket.write(headers);
//     socket.write(message);
//   }

//   socket.end();
// }

//     // GET /user-agent
//     else if (path === "/user-agent") {
//       const lines = request.split("\r\n");

//       let userAgent = "";

//       for (const line of lines) {
//         if (line.startsWith("User-Agent:")) {
//           userAgent = line.split(": ")[1];
//           break;
//         }
//       }

//       socket.write(
//         `HTTP/1.1 200 OK\r\n` +
//         `Content-Type: text/plain\r\n` +
//         `Content-Length: ${userAgent.length}\r\n` +
//         `\r\n` +
//         userAgent
//       );

//       socket.end();
//     }

//     // POST /files/{filename}
//     else if (method === "POST" && path.startsWith("/files/")) {
//       const filename = path.substring(7);
//       const filePath = pathModule.join(directory, filename);

//       const body = request.split("\r\n\r\n")[1];

//       fs.writeFile(filePath, body, (err) => {
//         if (err) {
//           socket.write("HTTP/1.1 500 Internal Server Error\r\n\r\n");
//         } else {
//           socket.write("HTTP/1.1 201 Created\r\n\r\n");
//         }

//         socket.end();
//       });

//       return;
//     }

//     // GET /files/{filename}
//     else if (method === "GET" && path.startsWith("/files/")) {
//       const filename = path.substring(7);
//       const filePath = pathModule.join(directory, filename);

//       fs.readFile(filePath, (err, fileData) => {
//         if (err) {
//           socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//         } else {
//           socket.write(
//             `HTTP/1.1 200 OK\r\n` +
//             `Content-Type: application/octet-stream\r\n` +
//             `Content-Length: ${fileData.length}\r\n` +
//             `\r\n`
//           );

//           socket.write(fileData);
//         }

//         socket.end();
//       });

//       return;
//     }

//     // Unknown route
//     else {
//       socket.write("HTTP/1.1 404 Not Found\r\n\r\n");
//       socket.end();
//     }
//   });
// });

// server.listen(4221, "localhost");

const net = require("net");
const fs = require("fs");
const pathModule = require("path");
const zlib = require("zlib");

const args = process.argv.slice(2);

let directory = null;

if (args[0] === "--directory") {
  directory = args[1];
}

const server = net.createServer((socket) => {
  socket.on("data", (data) => {
    const request = data.toString();
    const lines = request.split("\r\n");

    let acceptEncoding = "";
    let connectionHeader = "";

    for (const line of lines) {
      if (line.startsWith("Accept-Encoding:")) {
        acceptEncoding = line.split(":")[1].trim();
      }
      if (line.startsWith("Connection:")) {
        connectionHeader = line.split(":")[1].trim();
      }
    }

    const shouldClose = connectionHeader.toLowerCase() === "close";
    const connectionResponseHeader = shouldClose ? `Connection: close\r\n` : "";

    const method = request.split(" ")[0];
    const path = request.split(" ")[1];

    const finish = () => {
      if (shouldClose) {
        socket.end();
      }
    };

    // GET /
    if (path === "/") {
      socket.write(
        `HTTP/1.1 200 OK\r\n` +
        connectionResponseHeader +
        `\r\n`
      );
      finish();
    }

    // GET /echo/{message}
    else if (path.startsWith("/echo/")) {
      const message = path.substring(6);

      if (acceptEncoding.includes("gzip")) {
        const compressed = zlib.gzipSync(message);

        const headers =
          `HTTP/1.1 200 OK\r\n` +
          `Content-Type: text/plain\r\n` +
          `Content-Encoding: gzip\r\n` +
          connectionResponseHeader +
          `Content-Length: ${compressed.length}\r\n` +
          `\r\n`;

        socket.write(headers);
        socket.write(compressed);
      } else {
        const headers =
          `HTTP/1.1 200 OK\r\n` +
          `Content-Type: text/plain\r\n` +
          connectionResponseHeader +
          `Content-Length: ${message.length}\r\n` +
          `\r\n`;

        socket.write(headers);
        socket.write(message);
      }
      finish();
    }

    // GET /user-agent
    else if (path === "/user-agent") {
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
        connectionResponseHeader +
        `Content-Length: ${userAgent.length}\r\n` +
        `\r\n` +
        userAgent
      );
      finish();
    }

    // POST /files/{filename}
    else if (method === "POST" && path.startsWith("/files/")) {
      const filename = path.substring(7);
      const filePath = pathModule.join(directory, filename);
      const body = request.split("\r\n\r\n")[1];

      fs.writeFile(filePath, body, (err) => {
        if (err) {
          socket.write(`HTTP/1.1 500 Internal Server Error\r\n${connectionResponseHeader}\r\n`);
        } else {
          socket.write(`HTTP/1.1 201 Created\r\n${connectionResponseHeader}\r\n`);
        }
        finish();
      });
    }

    // GET /files/{filename}
    else if (method === "GET" && path.startsWith("/files/")) {
      const filename = path.substring(7);
      const filePath = pathModule.join(directory, filename);

      fs.readFile(filePath, (err, fileData) => {
        if (err) {
          socket.write(`HTTP/1.1 404 Not Found\r\n${connectionResponseHeader}\r\n`);
        } else {
          socket.write(
            `HTTP/1.1 200 OK\r\n` +
            `Content-Type: application/octet-stream\r\n` +
            connectionResponseHeader +
            `Content-Length: ${fileData.length}\r\n` +
            `\r\n`
          );
          socket.write(fileData);
        }
        finish();
      });
    }

    // Unknown route
    else {
      socket.write(`HTTP/1.1 404 Not Found\r\n${connectionResponseHeader}\r\n`);
      finish();
    }
  });
});

server.listen(4221, "localhost");