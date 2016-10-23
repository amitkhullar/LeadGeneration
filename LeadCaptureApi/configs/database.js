// configs/database.js

'use strict';

// dependencies
const mongoose = require('mongoose');

// set the database name
const dbName = 'LeadOrganizerApi';


mongoose.Promise = global.Promise;

// connect to the database
mongoose.connect(`mongodb://localhost/${dbName}`);

// get notified if the connection
// was successful or not
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log(`Connected to the ${dbName} database`);
});
