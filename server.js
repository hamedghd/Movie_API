// imports the http, fs and url modules
const http = require('http'),
  fs = require('fs'),
  url = require('url');

// Creates a new server.
http.createServer((request, response) => {
  let addr = request.url,
    q = url.parse(addr, true),
    filePath = '';

  // Creates a log of recent requests made to the server.
  fs.appendFile('log.txt', 'URL: ' + addr + '\nTimestamp: ' +
  new Date() + '\n\n', (err) => {
    if (err) {
      console.log(err);
    } else {
      console.log('Added to log.');
    }
  });

  // If pathname includes documentation,
  // it returns the documentation.html.
  // If pathname doesn't include “documentation”,
  // the if-else statement returns “index.html”.
  if (q.pathname.includes('documentation')) {
    filePath = (__dirname + '/documentation.html');
  } else {
    filePath = 'index.html';
  }
  // The fs module sends back the appropriate file.
  // Throws an error and terminates the function if the file can’t be read.
  fs.readFile(filePath, (err, data) => {
    if (err) {
      throw err;
    }

    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(data);
    response.end();

  })
}).listen(8080);
// Creates a message on console.
console.log('My test server is running on Port 8080.');
