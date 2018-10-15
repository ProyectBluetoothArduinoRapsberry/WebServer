'use strict';

// Authentication module.
const http = require('http');
const WebSocket = require('ws');
const express = require('express');
var auth = require('http-auth');
var fs = require('fs');
var xml2js = require('xml2js');
var url = require('url');

const PORT = process.env.PORT || 3000;



const wssRasp = new WebSocket.Server({ noServer: true });
const wssClient = new WebSocket.Server({ noServer: true });

var clientsExists = false;
var authenticated = false;

wssRasp.on('connection', function connection(wsr) {
  wsr.send("test");
  wsr.on('message', function incoming(message) {
      wssClient.clients.forEach(function each(ws) {
        ws.send(message);
        //console.log('received: %s', message);
      });
      //console.log('received: %s', message);
  });
  wssClient.on('connection', function connection(wsc) {
    console.log("test");
    wsc.on('message', function incoming(message) {
        wssRasp.clients.forEach(function each(ws) {
          ws.send(message);
          console.log("");
          console.log('rasp: %s', message);
        });
        console.log('received: %s', message);
    });

  });
});


var parser = new xml2js.Parser();
var basic = auth.basic({realm: "Sistema Control."}, (username, password, callback) => {
      fs.readFile('./config/users.xml', function(err, data) {
          parser.parseString(data, function (err, result) {
            authenticated = false;
            result.users.user.forEach(function(element) {
              authenticated = authenticated || (username === element.username[0] && password === element.password[0]);
            });
          });
          callback(authenticated);
      });

    }
);

// Creating new HTTP server.
const server = http.createServer(basic, (req, res) => {

  if(req.url.indexOf('.js') != -1){ //req.url has the pathname, check if it conatins '.js'
    fs.readFile(__dirname + '/public/scripts/sistemaControl.js', function (err, data) {
      if (err) console.log(err);
      res.writeHead(200, {'Content-Type': 'text/javascript'});
      res.write(data);
      res.end();
    });
  }else if(req.url.indexOf('.css') != -1){ //req.url has the pathname, check if it conatins '.css'

    fs.readFile(__dirname + '/public/css/sistemaControl.css', function (err, data) {
      if (err) console.log(err);
      res.writeHead(200, {'Content-Type': 'text/css'});
      res.write(data);
      res.end();
    });
  }else if(req.url.indexOf('favicon.png') != -1){ //req.url has the pathname, check if it conatins '.css'
    fs.readFile(__dirname + '/public/images/favicon.png', function (err, data) {
      if (err) console.log(err);
      res.writeHead(200, {'Content-Type': 'image/png'});
      res.write(data);
      res.end();
    });
  }else{
    fs.readFile('index.html', function(err, data) {
      res.writeHead(200, {'Content-Type': 'text/html'});
      res.write(data);
      res.end();
    });
  }


});

server.on('upgrade', function upgrasde(request, socket, head) {
  const pathname = url.parse(request.url).pathname;

  if (pathname === '/rasp') {
    wssRasp.handleUpgrade(request, socket, head, function done(ws) {
      wssRasp.emit('connection', ws, request);
    });
  } else if (pathname === '/client') {
    wssClient.handleUpgrade(request, socket, head, function done(ws) {
      wssClient.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(PORT, () => console.log(`Listening on ${ PORT }`));
