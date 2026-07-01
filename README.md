<!-- [![progress-banner](https://backend.codecrafters.io/progress/http-server/c45a61a2-944a-44e0-be4f-387a9ee8725a)](https://app.codecrafters.io/users/Sam-syntax35?r=2qF)

This is a JavaScript solution to the
["Build Your Own HTTP server" Challenge](https://app.codecrafters.io/courses/http-server/overview).

[HTTP](https://en.wikipedia.org/wiki/Hypertext_Transfer_Protocol) is the
protocol that powers the web. This project implements an HTTP/1.1 server
from scratch on top of raw TCP sockets — no `http` module, no frameworks —
capable of serving multiple concurrent clients over persistent connections.

**Note**: If you're viewing this repo on GitHub, head over to
[codecrafters.io](https://codecrafters.io) to try the challenge.

---

## Features implemented

The server is built using Node's low-level `net` module and manually parses
and constructs raw HTTP/1.1 messages. Supported functionality:

### Routing
- `GET /` — returns a bare `200 OK`.
- `GET /echo/{message}` — echoes `{message}` back as the response body
  (`Content-Type: text/plain`).
- `GET /user-agent` — reads the `User-Agent` request header and returns it
  as the response body.
- `GET /files/{filename}` — reads `{directory}/{filename}` from disk and
  returns it as `application/octet-stream`. Returns `404 Not Found` if the
  file doesn't exist.
- `POST /files/{filename}` — writes the request body to
  `{directory}/{filename}` on disk. Returns `201 Created` on success or
  `500 Internal Server Error` on failure.
- Any unmatched route returns `404 Not Found`.

The root directory for `/files/{filename}` is read from the `--directory`
command-line flag at startup:

```sh
./your_program.sh --directory /tmp/
```

### Compression
- Parses the `Accept-Encoding` request header, including comma-separated
  lists with multiple/invalid schemes (e.g. `gzip, invalid-encoding`).
- If `gzip` is among the requested encodings, the response body is
  compressed with `zlib.gzipSync` and the response includes
  `Content-Encoding: gzip` with a `Content-Length` matching the
  **compressed** size.
- If `gzip` isn't supported by the client, the response is sent
  uncompressed with no `Content-Encoding` header.

### Persistent connections (keep-alive)
- Connections are persistent by default, per HTTP/1.1 semantics — the
  server does **not** close the TCP connection after each response.
- Each connection can carry multiple sequential requests, each parsed and
  handled independently.
- Multiple concurrent connections are handled simultaneously and in
  isolation from one another (each connection gets its own `socket` and
  request-local state — no shared/global mutable state between clients).

### `Connection: close`
- If a request includes `Connection: close`, the server:
  1. Processes the request normally.
  2. Includes `Connection: close` in its own response headers.
  3. Closes the TCP connection after the response has been fully sent.
- Connections without this header remain open for further requests.

---

## Project structure

The entry point is `app/main.js`, which contains the full TCP/HTTP server
implementation described above.

## Running locally

1. Ensure you have `node (25)` installed locally.
2. Run `./your_program.sh --directory /tmp/` to start the server (the
   `--directory` flag is required for the `/files` endpoints).
3. Test it with `curl`, e.g.:

```sh
   curl -i http://localhost:4221/
   curl -i http://localhost:4221/echo/hello
   curl -i -H "Accept-Encoding: gzip" http://localhost:4221/echo/hello
   curl -i http://localhost:4221/user-agent -H "User-Agent: my-client/1.0"
   curl -i http://localhost:4221/files/foo
   curl -i -X POST http://localhost:4221/files/foo -d "some data"
   curl --http1.1 -v http://localhost:4221/echo/orange 
     --next http://localhost:4221/ -H "Connection: close"
```

4. Run `codecrafters submit` to submit your solution to CodeCrafters. Test
   output will be streamed to your terminal. -->


   # 🚀 HTTP/1.1 Server From Scratch (Node.js)

[![progress-banner](https://backend.codecrafters.io/progress/http-server/c45a61a2-944a-44e0-be4f-387a9ee8725a)](https://app.codecrafters.io/users/Sam-syntax35?r=2qF)

A production-style **HTTP/1.1 server built completely from scratch** using **Node.js** and the low-level **`net`** module.

Unlike traditional backend projects that use Express or Node's built-in `http` module, this project manually implements the HTTP protocol on top of raw TCP sockets. Every HTTP request is parsed manually, every response is constructed manually, and TCP connections are managed directly.

This project was built while completing the CodeCrafters **"Build Your Own HTTP Server"** challenge to gain a deep understanding of networking, HTTP internals, TCP sockets, compression, and concurrent server programming.

---

# 📌 Recruiter Highlights

* ✅ Built an **HTTP/1.1 server from scratch** without using Node's built-in `http` module.
* ✅ Implemented directly on top of Node.js' **`net` module** using raw TCP sockets.
* ✅ Manually parsed HTTP request lines, headers, and request bodies.
* ✅ Manually constructed HTTP responses according to the HTTP/1.1 specification.
* ✅ Implemented routing, file upload/download, gzip compression, persistent connections (Keep-Alive), concurrent client handling, and graceful connection closing.
* ✅ Worked directly with **Buffers**, **binary data**, **TCP sockets**, and **HTTP protocol internals**.
* ✅ Strengthened understanding of networking, event-driven programming, operating system concepts, and backend architecture.

---

# ✨ Features

### HTTP Routing

* `GET /`
* `GET /echo/{message}`
* `GET /user-agent`
* `GET /files/{filename}`
* `POST /files/{filename}`
* `404 Not Found`

---

### File Handling

* Read files from disk
* Write request body into files
* Binary file responses
* Configurable root directory using `--directory`

---

### HTTP Compression

* Parses `Accept-Encoding`
* Supports multiple compression schemes in request headers
* Implements gzip compression using `zlib`
* Sends proper `Content-Encoding`
* Sends correct compressed `Content-Length`

---

### Persistent Connections

* HTTP/1.1 Keep-Alive support
* Multiple HTTP requests over the same TCP connection
* Independent request processing

---

### Concurrent Connections

* Multiple TCP clients handled simultaneously
* Independent socket state
* Event-driven asynchronous networking

---

### Connection Close

Supports:

```http
Connection: close
```

The server:

* Processes the request
* Sends the response
* Returns `Connection: close`
* Gracefully closes the TCP socket

---

# 🛠 Tech Stack

| Technology        | Purpose              |
| ----------------- | -------------------- |
| Node.js           | Runtime              |
| JavaScript (ES6+) | Programming Language |
| `net`             | Raw TCP Server       |
| `fs`              | File Operations      |
| `path`            | File Path Handling   |
| `zlib`            | Gzip Compression     |
| HTTP/1.1          | Application Protocol |

---

# 🏗 High-Level Architecture

```text
                           Client (Browser / curl)
                                      │
                                      │ HTTP Request
                                      ▼
                           TCP Connection
                                      │
                                      ▼
                   Node.js `net.createServer()`
                                      │
                             socket.on("data")
                                      │
                                      ▼
                        Raw HTTP Request Parser
          ┌──────────────────┼──────────────────┐
          │                  │                  │
     Request Line         Headers            Body
          │                  │                  │
          └──────────────────┴──────────────────┘
                             │
                             ▼
                           Router
      ┌──────────────┬───────────────┬──────────────┐
      │              │               │              │
    /echo      /user-agent        /files       Unknown
      │              │               │              │
      └──────────────┴───────────────┴──────────────┘
                             │
                   Business Logic Layer
           ┌─────────────────┴─────────────────┐
           │                                   │
     File System (`fs`)                 Compression (`zlib`)
           │                                   │
           └─────────────────┬─────────────────┘
                             ▼
                 HTTP Response Builder
                             │
                 Status Line
                 Response Headers
                 Response Body
                             │
                             ▼
                       socket.write()
                             │
                             ▼
                           Client
```

---

# 🔄 HTTP Request Lifecycle

```text
Client
   │
   │ Open TCP Connection
   ▼
Node.js TCP Server (`net`)
   │
   ▼
socket.on("data")
   │
   ▼
Receive Buffer
   │
   ▼
Buffer → String
   │
   ▼
Parse HTTP Request
   │
   ▼
Extract

• Method
• Path
• HTTP Version
• Headers
• Body
   │
   ▼
Route Matching
   │
   ▼
Business Logic

• Echo
• File Read
• File Write
• Compression
• User-Agent
   │
   ▼
Build HTTP Response
   │
   ▼
socket.write()
   │
   ▼
Client receives response
```

---

# 🌐 HTTP Message Format

Incoming Request

```http
GET /echo/hello HTTP/1.1
Host: localhost:4221
User-Agent: curl
Accept-Encoding: gzip

```

Parsed into

```text
Method:
GET

Path:
/echo/hello

Version:
HTTP/1.1

Headers:
Host
User-Agent
Accept-Encoding

Body:
(optional)
```

Response

```http
HTTP/1.1 200 OK
Content-Type: text/plain
Content-Encoding: gzip
Content-Length: 23

<binary response>
```

---

# 💡 Why Build on the `net` Module?

Instead of using Node.js' built-in `http` module, this project is implemented directly on top of the low-level **`net`** module.

Using `net` means the server works directly with **raw TCP sockets**, requiring manual implementation of features that frameworks usually provide automatically.

Implemented manually:

* TCP socket communication
* HTTP request parsing
* HTTP response generation
* HTTP routing
* Header parsing
* File serving
* File uploads
* Persistent connections
* Concurrent client handling
* Gzip compression
* Connection lifecycle management
* Buffer handling
* Binary response transmission

This approach provides a much deeper understanding of how web servers operate internally.

---

# 📂 Project Structure

```text
.
├── app
│   └── main.js
├── codecrafters.yml
├── your_program.sh
├── README.md
└── .gitignore
```

---

# 🚀 Running Locally

Clone the repository

```bash
git clone https://github.com/Sam-syntax35/Http-server-from-scratch.git
```

Move into the project

```bash
cd Http-server-from-scratch
```

Start the server

```bash
./your_program.sh --directory /tmp
```

---

# 🧪 Example Requests

### Root

```bash
curl -i http://localhost:4221/
```

### Echo

```bash
curl -i http://localhost:4221/echo/hello
```

### User-Agent

```bash
curl -i \
-H "User-Agent: MyClient/1.0" \
http://localhost:4221/user-agent
```

### Gzip Compression

```bash
curl -i \
-H "Accept-Encoding: gzip" \
http://localhost:4221/echo/hello
```

### Upload File

```bash
curl -X POST \
-d "Hello World" \
http://localhost:4221/files/demo.txt
```

### Download File

```bash
curl http://localhost:4221/files/demo.txt
```

### Persistent Connection

```bash
curl --http1.1 \
http://localhost:4221/echo/apple \
--next \
http://localhost:4221/user-agent \
-H "User-Agent: demo-client"
```

---

# 🧠 Backend Concepts Implemented

### Networking

* TCP Sockets
* Client–Server Communication
* Persistent Connections
* Concurrent Connections
* Socket Lifecycle

### HTTP

* HTTP/1.1
* Request Parsing
* Response Construction
* Status Codes
* Request Headers
* Response Headers
* MIME Types
* Content Negotiation

### File System

* Reading Files
* Writing Files
* Binary File Transfer

### Compression

* Gzip Compression
* Binary Responses
* Content-Encoding
* Content-Length

### Node.js

* Event Loop
* Event-driven Programming
* Asynchronous I/O
* Buffers
* Streams (socket writes)
* Core Modules

---

# 📖 What I Learned

Building this project helped me understand:

* How HTTP works internally
* How TCP sockets power HTTP communication
* Why web frameworks exist and what they abstract away
* Manual HTTP parsing and serialization
* Binary data handling using Buffers
* HTTP compression using gzip
* Persistent HTTP/1.1 connections (Keep-Alive)
* Concurrent client handling
* Low-level networking in Node.js
* Event-driven backend architecture

---

# 🚀 Future Improvements

* HTTPS/TLS Support
* Chunked Transfer Encoding
* MIME Type Detection
* Static Website Hosting
* HTTP Caching
* Range Requests
* Logging
* Configuration File Support
* Graceful Shutdown
* Performance Benchmarking
* Unit & Integration Tests

---

# 🏆 Project Significance

Most backend applications rely on frameworks like Express, Fastify, or NestJS, where the underlying HTTP implementation is abstracted away.

This project focuses on implementing the protocol itself, demonstrating practical knowledge of:

* HTTP protocol internals
* TCP networking
* Socket programming
* Binary data handling
* Compression
* File I/O
* Concurrent server programming
* Event-driven architecture

Understanding these concepts provides a strong foundation for backend engineering and makes it easier to understand how modern web frameworks and production web servers work internally.
