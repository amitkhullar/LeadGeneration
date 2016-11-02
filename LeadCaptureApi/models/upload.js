// models/task.js

'use strict';

const mongoose = require('mongoose');

const uploadSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'A name for identifying the upload'] },
  isActive: {type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, default: -1 }

});

module.exports.uploads = mongoose.model('uploads', uploadSchema);

const uploadDataSchema = new mongoose.Schema({
  name: { type: String, required: [true, 'A name for identifying the upload'] },
  isActive: {type: Boolean, default: true},
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, default: -1 }

});

module.exports.uploadData = mongoose.model('uploadData', uploadDataSchema);
