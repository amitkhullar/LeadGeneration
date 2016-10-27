

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
.put((req,res) => {
    console.log("request lead with id :"+req.params.id);

    // var result = {"lead1":{},"contacts1":[]};

    var updatedLead = req.body;


    var newLead = {
      companyName         : updatedLead.companyInfo.companyName,
      currentStatus       : updatedLead.companyInfo.currentStatus,
      industryVertical    : updatedLead.companyInfo.industryVertical,
      industrySubVertical : updatedLead.companyInfo.industrySubVertical,
      aboutCompany        : updatedLead.companyInfo.aboutCompany,
      contactSource       : updatedLead.companyInfo.contactSource,
      productsInterested  : updatedLead.companyInfo.productsInterested,
      companyType         : updatedLead.companyInfo.companyType,
      // leadCaptureDate     : leadData.companyInfo.leadCaptureDate,

      addressBuilding     : updatedLead.address.building,
      addressTownStreet   : updatedLead.address.town,
      addressCity         : updatedLead.address.city,
      addressState        : updatedLead.address.state,
      addressPincode      : updatedLead.address.pin,

      companyScale        : updatedLead.additionalProfile.companyScale,
      employeeCount       : updatedLead.additionalProfile.employeeCnt,
      travelBudget        : updatedLead.additionalProfile.travelBudget,
      vendorCount         : updatedLead.additionalProfile.vendorCount,
      vendorHandlerCount  : updatedLead.additionalProfile.vendorHandlingCount,
      transactionCount    : updatedLead.additionalProfile.transactionCnt,
      mailingDate         : updatedLead.additionalProfile.mailingDate
    };

    console.log("newLead:\n"+newLead);

    Lead.findOneAndUpdate(req.params.id, newLead, {new: true}, function(err, lead){
        if(err){
            console.log("Something wrong when updating data!"+err);
            return res.json({ message: 'error updating lead with id : '+req.params.id });
        }
        console.log("updated lead id : "+lead._id);
        console.log("updated contacts : "+updatedLead.contacts);
        for(var contact of updatedLead.contacts)
        {
          contact.lead = lead._id;
        }

        Contact.collection.remove({lead: lead._id});


        Contact.collection.insertMany(updatedLead.contacts,function(err,inserted)
        {
            if(err)
            {
              return res.json({ message: 'error updating lead with id : '+lead._id });
            }
            else
            {
              console.log("updated");
              return res.json({ message: 'lead updated! with id : '+lead._id });
            }

        });


    });

  });


  router.route('/leads/stats')
  .get((req,res) =>
  {

    console.log("request stats");
    Lead.count({"currentStatus":""},function(err,count){

      if(err)
      {
          console.log("Error for status count");
          res.json({"message":"error in status count"+err});
      }
      console.log("responded"+count);

      Lead.count({},function(err,leadCount){

        if(err)
        {
            console.log("Error for stats generation");
            res.json({"message":"Error for stats generation"+err});
        }

        res.json({new_leads : 0,leads_responded : leadCount - count,pending_action : count});

      });

    });



  });

router.route('/leads/search')
.post((req,res) =>
{

  console.log("rules : "+req.body.rules);
  var contactSources = req.body.rules.contactSource.value;
  var companyTypes = req.body.rules.companyType.value;

  companyTypes.forEach((item,index)=>{

      var exp = new RegExp(["^", companyTypes[index], "$"].join(""), "i")
      req.body.rules.companyType.regex.push(exp);
      companyTypes[index] = exp;

  });

  contactSources.forEach((item,index)=>{

      var exp = new RegExp(["^", contactSources[index], "$"].join(""), "i")
      req.body.rules.contactSource.regex.push(exp);
      contactSources[index] = exp;

  });

  var exp = new RegExp(["^.*", req.body.rules.companyName.value, ".*$"].join(""), "i");
  req.body.rules.companyName.regex = exp;

  exp = new RegExp(["^", req.body.rules.industryVertical.value, "$"].join(""), "i");
  req.body.rules.industryVertical.regex = exp;

  exp = new RegExp(["^.*", req.body.rules.addressPincode.value, ".*$"].join(""), "i");
  req.body.rules.addressPincode.regex = exp;

  exp = new RegExp(["^", req.body.rules.addressCity.value, "$"].join(""), "i");
  req.body.rules.addressCity.regex = exp;

  exp = new RegExp(["^", req.body.rules.addressState.value, "$"].join(""), "i");
  req.body.rules.addressState.regex = exp;

  req.body.rules.employeeCount.regex = req.body.rules.employeeCount.value;

  var andFilters = [];
  var orFilters = [];
  for(var filter in req.body.rules)
  {
    if(req.body.rules[filter].operator == 'and')
    {
      if(Array.isArray(req.body.rules[filter].regex)){
        var ele = {};
        ele[filter] = { "$in" : req.body.rules[filter].regex };
        andFilters.push(ele);
      }
      else {
        var ele = {};
        ele[filter] = req.body.rules[filter].regex;
        andFilters.push(ele);
      }
    }
    if(req.body.rules[filter].operator == 'or')
    {
      if(Array.isArray(req.body.rules[filter].regex)){
        var ele = {};
        ele[filter] = { "$in" : req.body.rules[filter].regex };
        orFilters.push(ele);
      }
      else {
        var ele = {};
        ele[filter] = req.body.rules[filter].regex;
        orFilters.push(ele);
      }
    }

  }
  console.log("andFilters :"+andFilters+" | orFilters : "+orFilters);

  // andFilters.forEach((item)=>
  // {
  //   console.log("and : "+item);
  // });
  // orFilters.forEach(function(item)
  // {
  //   console.log("or : "+item.filter);
  // });

  var operators = []
  if(orFilters.length > 0)
  {
    operators.push({"$or" : orFilters})
  }
  if(andFilters.length > 0)
  {
    operators.push({"$and" : andFilters})
  }
  // console.log("operators : "+operators["$or"]);
  Lead.find({ "$or": operators}
  ,function(err,leads)
  {
    if(err){

      console.log(err);

    }
    console.log("leads"+leads);
    res.json(leads);
  });


});

router.route('/leads/:id')
.get((req,res) => {
    console.log("request lead with id :"+req.params.id);

    // var result = {"lead1":{},"contacts1":[]};

    Contact.find({"lead":req.params.id},function(err,contacts){


      console.log("contacts returned "+contacts);
      // result.contacts1 = contacts;

      Lead.findById(req.params.id, (err, lead) => {
        if (err){
          return res.send(err);
        }
        // result.lead1 = lead;
        res.json({"lead":lead,"contacts":contacts});

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
