const http = require('http');

const PORT = 7001;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Service B is running',
    timestamp: new Date().toISOString(),
    service: 'service-b'
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Service B listening on port ${PORT}`);
});