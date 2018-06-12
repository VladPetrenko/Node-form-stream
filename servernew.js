'use strict'

const http = require('http');
const fs = require('fs');
const querystring = require('querystring');
const port = 5000;
const server = http.createServer(handler);

function handler(request, response) {
    request
        .on('error', (err) => {
            console.error(err);
            response.statusCode = 400;
            response.end();
        });
    response
        .on('error', (err) => {
            console.error(err);
        });

    if (request.method === 'GET' && request.url === '/') {
        response
            .writeHead(200, {'Content-Type': 'utf-8'});
        fs
            .createReadStream('./index.html')
            .pipe(response);
    } else if(request.method === 'POST') {
        let postData = '';
        request
            .on('data', (postDataChunk) => {
                postData += postDataChunk;
            })
            .on('end', () => {
                let data = querystring.parse(postData);
                data = JSON.stringify(data);
                let writeStream = fs.createWriteStream('form.json', {flags: 'a'});
                writeStream.write(`${data}`);
                writeStream.end();
                response.writeHead(200, {'Content-Type': 'utf-8'});
                fs
                    .createReadStream('./sucsess.html')
                    .pipe(response);
            });
    }
}

let serverMsg = () => console.log(`вроде работает, port: ${port}`);

server.listen(port, serverMsg);

