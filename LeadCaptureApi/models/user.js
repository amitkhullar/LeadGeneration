// models/task.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  name: { type: String, required: [true, 'User name'] },
  email: { type: String, required: [true, 'Email id'] },
  p_validate: { type: String, required: [true, 'Password'] },
  s_validate: { type: String, required: [true, 'Salt'] },
  roles: [],
  createdAt: { type: Date, default: Date.now },
  modifiedAt: { type: Date, default: Date.now },
  modifiedBy: { type: String, default: "" }


});

module.exports = mongoose.model('users', schema);
