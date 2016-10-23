// server.js

'use strict';

// dependencies
const express = require('express');
const bodyParser = require('body-parser');

// create the express app
const app = express();


// database connection
require('./configs/database');

// configure the body-parser
// to accept urlencoded bodies
// and json data
app.use(bodyParser.urlencoded({ extended: true }))
   .use(bodyParser.json());

app.use(function(req, res, next) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
  res.setHeader("Access-Control-Allow-Headers", "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

 next();
});


// register all routers
// all routes are prefixed with /api
app.use('/api', require('./routes/lead'));

// set the port
const port = parseInt(process.env.PORT, 10) || 8005;

// start the server
const server = app.listen(port, () => {
  console.log(`App is running at: localhost:${server.address().port}`);
});
