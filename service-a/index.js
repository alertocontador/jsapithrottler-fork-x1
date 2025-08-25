const http = require('http');

const PORT = 7000;

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    message: 'Service A is running',
    timestamp: new Date().toISOString(),
    service: 'service-a'
  }));
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`Service A listening on port ${PORT}`);
});