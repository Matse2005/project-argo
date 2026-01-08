const http = require("http");

const server = http.createServer((req, res) => {
  const env = process.env.ENV || "unknown";
  res.writeHead(200);
  res.end(`Hello from ${env} automated environment updated with keel\n`);
});

if (require.main === module) {
  server.listen(3000, () => {
    console.log("Server running");
  });
}

module.exports = server;
