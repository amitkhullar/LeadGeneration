// models/task.js

'use strict';

const mongoose = require('mongoose');

const schema = new mongoose.Schema({
  companyName: { type: String, required: [true, 'A company name is required'] },
  currentStatus: { type: String, maxlength: [50, 'Only 50 characters or less are allowed'] },
  industryVertical: { type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  industrySubVertical: { type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  aboutCompany: { type: String, maxlength: [2000, 'Only 2000 characters or less are allowed'] },
  contactSource: { type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  productsInterested: { type: String, maxlength: [1000, 'Only 1000 characters or less are allowed'] },
  companyType: { type: String, maxlength: [50, 'Only 50 characters or less are allowed'] },
  leadCaptureDate: { type: Date, default: Date.now },

  addressBuilding:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  addressTownStreet:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  addressCity:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  addressState:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  addressPincode:{ type: String, maxlength: [8, 'Only 8 characters or less are allowed'] },

  companyScale:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed'] },
  employeeCount:{ type: Number },
  travelBudget:{ type: String, maxlength: [100, 'Only 100 characters or less are allowed']  },
  vendorCount:{ type: Number  },
  vendorHandlerCount:{ type: Number  },
  transactionCount:{ type: Number  },
  mailingDate:{ type: Date, default: null},

  completed: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  createdBy: { type: Number, default: -1 },
  contacts : [{ type: mongoose.Schema.Types.ObjectId, ref: 'contacts' }]

});

module.exports = mongoose.model('leads', schema);
