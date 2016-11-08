// models/task.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'A contact name is required'] },
  designation: { type: String, maxlength: [50, 'Only 50 characters or less are allowed'] },
  email: { type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  landline: [],
  mobile: [],
  lead:  { type: mongoose.Schema.Types.ObjectId, ref: 'leads'},
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, default: -1 }

});

module.exports = mongoose.model('contacts', schema);
