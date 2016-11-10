// server.js

'use strict';

// dependencies
const express = require('express');
const bodyParser = require('body-parser');

// create the express app
const app = express();


// database connection
require('./configs/database');
const uploadRepo = require('./repositories/uploadRepo').uploadRepo;

// configure the body-parser
// to accept urlencoded bodies
// and json data
app.use(bodyParser.urlencoded({ extended: true }))
   .use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

 next();
});


// register all routers
// all routes are prefixed with /api
app.use('/api', require('./routes/lead'));

var serveStatic = require('serve-static');
app.use(serveStatic(__dirname, {'index': ['/public/index.html']}))

// set the port
const port = parseInt(process.env.PORT, 10) || 8005;

// start the server
const server = app.listen(port, () => {
  console.log(`App is running at: localhost:${server.address().port}`);
});

var io = require('socket.io').listen(server);


var ss = require('socket.io-stream');
var path = require('path');
var fs = require('fs');
var Excel = require('exceljs');
var filename = "";
var flg = false;

io.on('connection', function(socket) {

  console.log('new connection for uploads established');
  console.log(socket.id);


  socket.on('disconnect', function(){
    console.log('user disconnected');
  });

  if(!flg)
  {
    ss(socket).on('start-upload', function(stream, data) {
      console.log("start upload hit");
      filename = path.basename(data.name);
      console.log("file : "+filename);
      stream.pipe(fs.createWriteStream(filename));
    });

  socket.on('start-processing',function(){
      flg = false;
      console.log("start processing"+socket);
      uploadRepo.filename = filename;
      uploadRepo.server = server;
      uploadRepo.socket = socket;
      uploadRepo.progress = 0;
      uploadRepo.duplicate = 0;
      uploadRepo.process();

  });
  flg = true;
}


});
