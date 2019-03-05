const http = require('http');
const hostname = 'localhost';
const port = 3000;

const server = http.createServer((req, res) => {
	res.stausCode = 200;
	res.setHeader('Content-Type', 'text/plan');
	res.end('Hello World!\n');
});

server.listen(port, hostname, () => {
	console.log(`Server runnng at http://${hostname}:${port}/`);
});
