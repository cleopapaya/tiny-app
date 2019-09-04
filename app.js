const http = require("http");
const PORT = 8080;

// a function which handles requests and sends response
const requestHandler = function(request, response) {
  if (`${request.url}` === '/') {
    console.log(request.url);
    response.end(`WELCOME`);
  } else if (`${request.url}` === '/urls') {
    console.log(request.url);
    response.end(`respond with some URLs`);
  }
  console.log(request.url);
  response.end(`404 Page Not Found`);
};

const server = http.createServer(requestHandler);
console.log('Server created');

server.listen(PORT, () => {
  console.log(`Server listening on: http://localhost:${PORT}`);
});

console.log('Last line (after .listen call)');