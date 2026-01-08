const http = require("http");

const server = http.createServer((req, res) => {
  const env = process.env.ENV || "unknown";
  const timestamp = "2026-01-08T13:45:54.540Z"; // <— this will be updated by script
  res.writeHead(200);
  res.end(`Hello from ${env} - ${timestamp}\n`);
});

if (require.main === module) {
  server.listen(3000, () => {
    console.log("Server running");
  });
}

module.exports = server;
