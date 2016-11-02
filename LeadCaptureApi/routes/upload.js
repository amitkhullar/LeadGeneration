

'use strict'

const express = require('express');

const Lead = require('../models/lead');
const Contact = require('../models/contact');
const Contact = require('../models/upload');

const router = express.Router();

// upload data
router.route('/uploads')
.post((req, res) => {


  var insertedContactIds = [];
  var contacts = [];
  var leadData = req.body;
  contacts = leadData.contacts;
  console.log("post request"+leadData.companyInfo);

  var lead = new Lead({
    companyName         : leadData.companyInfo.companyName,
    currentStatus       : leadData.companyInfo.currentStatus,
    industryVertical    : leadData.companyInfo.industryVertical,
    industrySubVertical : leadData.companyInfo.industrySubVertical,
    aboutCompany        : leadData.companyInfo.aboutCompany,
    contactSource       : leadData.companyInfo.contactSource,
    productsInterested  : leadData.companyInfo.productsInterested,
    companyType         : leadData.companyInfo.companyType,
    // leadCaptureDate     : leadData.companyInfo.leadCaptureDate,

    addressBuilding     : leadData.address.building,
    addressTownStreet   : leadData.address.town,
    addressCity         : leadData.address.city,
    addressState        : leadData.address.state,
    addressPincode      : leadData.address.pin,

    companyScale        : leadData.additionalProfile.companyScale,
    employeeCount       : leadData.additionalProfile.employeeCnt,
    travelBudget        : leadData.additionalProfile.travelBudget,
    vendorCount         : leadData.additionalProfile.vendorCount,
    vendorHandlerCount  : leadData.additionalProfile.vendorHandlingCount,
    transactionCount    : leadData.additionalProfile.transactionCnt,
    mailingDate         : leadData.additionalProfile.mailingDate
  });

  lead.save((err,lead) => {
    if (err){
      return res.send(err);
    }

    for(var contact of contacts)
    {
      contact.lead = lead._id;
    }
    console.log("contacts :"+contacts);
    Contact.collection.insertMany(contacts,function(err,inserted)
    {
        if(err)
        {

        }
        else
        {
          return res.json({ message: 'New lead created! with id : '+lead.id });
        }

    });

  });

});

module.exports = router;
