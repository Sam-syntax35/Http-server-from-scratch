[![progress-banner](https://backend.codecrafters.io/progress/http-server/c45a61a2-944a-44e0-be4f-387a9ee8725a)](https://app.codecrafters.io/users/Sam-syntax35?r=2qF)

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
   output will be streamed to your terminal.