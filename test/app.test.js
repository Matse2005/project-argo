process.env.ENV = "test";

const http = require("http");
const server = require("../src/app");

let listener;

beforeAll((done) => {
  listener = server.listen(0, done);
});

afterAll((done) => {
  listener.close(done);
});

test("returns environment and timestamp in response", (done) => {
  const port = listener.address().port;
  const timestamp = "2026-01-08T13:45:54.540Z"; // <— same timestamp as in app.js

  http.get(`http://localhost:${port}`, (res) => {
    let data = "";

    res.on("data", (chunk) => {
      data += chunk;
    });

    res.on("end", () => {
      expect(res.statusCode).toBe(200);
      expect(data).toBe(`Hello from test - ${timestamp}\n`);
      done();
    });
  });
});
