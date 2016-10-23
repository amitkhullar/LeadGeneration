

'use strict'

const express = require('express');

const Lead = require('../models/lead');
const Contact = require('../models/contact');

const router = express.Router();


router.route('/test')
.post((req,res) => {

  var names = req.body.name;

  console.log("names : "+names);
  return res.send(names);

});

router.route('/leads/:id')
.get((req,res) => {
    console.log("request lead with id :"+req.params.id);
    Lead.findById(req.params.id, (err, lead) => {
      if (err){
        return res.send(err);
      }
      console.log("leadid : "+lead._id);
      Contact.where({"lead":lead._id},function(err,contacts){

        if(err)
        {
          return res.json({"message":err});

        }

        var returnData = { "lead" : lead, "contacts" : contacts };

        // lead.contacts = contacts;
        console.log("contacts returned "+contacts);
        return res.json(returnData);

      });


    });

  });

router.route('/leads/:id')
.delete((req,res) =>
{
    console.log("delete lead with id :"+req.params.id);

    Lead.remove({_id:req.params.id},function(err){

      if (!err) {

          Contact.collection.remove({lead: req.params.id});
          res.send({"message":"Deleted lead with id : "+req.params.id});

      }
      else {
        res.send({"message":"Error deleting lead with id : "+req.params.id+", error : "+err});
      }

    });


  //   Lead.remove({ _id: req.params.id }, function(err)
  //   {
  //     console.log("err"+err);
  //   if (!err) {
  //           res.send({"deleted":req.params.id});
  //   }
  //   else {
  //           res.send({"message":"failed deleting"+req.params.id});
  //   }
  // });
});


router.route('/leads')
.get((req,res) =>
{

  Lead.find({}).sort({ createdAt: -1 })
      .exec((err, lead) => {
        if (err){
          return res.send(err);
        }
        return res.json(lead);
      });

});

router.route('/leads/stats')
.get((req,res) =>
{

  Lead.find({}).sort({ createdAt: -1 })
      .exec((err, lead) => {
        if (err){
          return res.send(err);
        }
        return res.json(lead);
      });

});

// insert new lead
router.route('/leads')
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
      contact.lead = lead.id;
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
