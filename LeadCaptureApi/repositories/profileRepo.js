const Lead = require('../models/lead');
const Contact = require('../models/contact');

var profileRepo = function () {

  var ctx = this;

  // private functions
  ctx.addLeadReferenceToContacts = function(contacts,profile){

    for(var contact of contacts)
    {
      contact.lead = profile._id;
      delete contact._id;
    }

  };

  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to insert new profile
    Input : takes 1 parameters
            - profile data to insert
    -------------------------------------------------------------------------------------------------------
  */
  ctx.insert = function(profile){

    var leadData = profile;
    var contacts = leadData.contacts;
    var lead = new Lead({
      companyName         : leadData.companyInfo.companyName,
      currentStatus       : leadData.companyInfo.currentStatus,
      industryVertical    : leadData.companyInfo.industryVertical,
      industrySubVertical : leadData.companyInfo.industrySubVertical,
      aboutCompany        : leadData.companyInfo.aboutCompany,
      contactSource       : leadData.companyInfo.contactSource,
      companyType         : leadData.companyInfo.companyType,
      companyScale        : leadData.companyInfo.companyScale,
      employeeCount       : leadData.companyInfo.employeeCnt,
      addressBuilding     : leadData.address.building,
      addressTownStreet   : leadData.address.town,
      addressCity         : leadData.address.city,
      addressState        : leadData.address.state,
      addressPincode      : leadData.address.pin
    });

    lead.save((err,profile) => {
      if (err){
        return {"message": "error inserting lead : "+err}
      }

      ctx.addLeadReferenceToContacts(contacts,profile);

      Contact.collection.insertMany(contacts,function(err,inserted)
      {
          if(err)
          {
            return {"message": "contacts insertion error : "+err}
          }
          else
          {
            return { message: 'New lead created! with id : '+lead.id };
          }

      });

    });

  };


  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method to return all profiles
    -------------------------------------------------------------------------------------------------------
  */
  ctx.getAll = function(){

    var getPromise = Lead.find({}).sort({ createdAt: -1 }).exec();
    return getPromise;

  };


  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to get a profile data
    Input : takes 1 parameters
            - profileid for the profile to delete
    -------------------------------------------------------------------------------------------------------
  */
  ctx.get = function(profileId){

    var leadPromise = Contact.find({"lead":profileId}).exec();

    return leadPromise.then((contacts)=>{

      return Lead.findById(profileId).then((lead)=>{

        return {"lead":lead,"contacts":contacts};

      });

    });

  };

  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to get the profile/lead statistics
    -------------------------------------------------------------------------------------------------------
  */
  ctx.getStats = function(){

    var statsPromise = Lead.count({"currentStatus":""});

    return statsPromise.then((statusCount)=>{

      return Lead.count({}).then((allProfileCount)=>{

        return {new_leads : 0,leads_responded : allProfileCount - statusCount,pending_action : statusCount};

      });

    });

  };

  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to delete existing profile
    Input : takes 1 parameters
            - profileid for the profile to delete
    -------------------------------------------------------------------------------------------------------
  */
  ctx.delete = function(profileId){

    Lead.remove({_id:profileId},function(err){

      if (!err) {

          Contact.collection.remove({lead: profileId});
          return {"message":"Deleted profile with id : "+profileId};

      }
      else {
        return {"message":"Error deleting lead with id : "+profileId+", error : "+err};
      }

    });


  };

  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to update the profile
    Input : takes 2 parameters
            - profileid
            - data to update
    -------------------------------------------------------------------------------------------------------
  */
  ctx.update = function(profileId,data){

    var updatedLead = data;

    var newLead = {
      companyName         : updatedLead.companyInfo.companyName,
      currentStatus       : updatedLead.companyInfo.currentStatus,
      industryVertical    : updatedLead.companyInfo.industryVertical,
      industrySubVertical : updatedLead.companyInfo.industrySubVertical,
      aboutCompany        : updatedLead.companyInfo.aboutCompany,
      contactSource       : updatedLead.companyInfo.contactSource,
      productsInterested  : updatedLead.companyInfo.productsInterested,
      companyType         : updatedLead.companyInfo.companyType,
      companyScale        : updatedLead.companyInfo.companyScale,
      employeeCount       : updatedLead.companyInfo.employeeCnt,
      // leadCaptureDate     : leadData.companyInfo.leadCaptureDate,

      addressBuilding     : updatedLead.address.building,
      addressTownStreet   : updatedLead.address.town,
      addressCity         : updatedLead.address.city,
      addressState        : updatedLead.address.state,
      addressPincode      : updatedLead.address.pin



    };

    Lead.update({_id:profileId}, newLead, {}, function(err, numberAffected){
        if(err){
            console.log("Something wrong when updating data!"+err);
            return { message: 'error updating lead with id : '+profileId };
        }
        console.log("updated lead"+profileId+" with affected rows : "+numberAffected);
        for(var contact of updatedLead.contacts)
        {
          contact.lead = profileId;
        }

        Contact.collection.remove({lead: profileId});


        Contact.collection.insertMany(updatedLead.contacts,function(err,inserted)
        {
            if(err)
            {
              return res.json({ message: 'error updating lead with id : '+profileId });
            }
            else
            {

              return { message: 'lead updated! with id : '+profileId };
            }

        });


    });


  };

  ctx.isDuplicate = function(data){

    var leadPromise = Lead.find ({"companyName":data.companyInfo.companyName}).exec();

    return leadPromise.then((profile)=>{

      if(profile.length > 0)
      {
        return true;
      }
      else {
        return false;
      }

    });

  };

  /*
    -------------------------------------------------------------------------------------------------------
    Desc : method is used to search the records based on differnt filter value combinations
    Input : takes the rules object defining various search parameters
    -------------------------------------------------------------------------------------------------------
  */
  ctx.search = function(rules){


    var contactSources = rules.contactSource.value;
    var companyTypes = rules.companyType.value;
    var contactRules = {};
    companyTypes.forEach((item,index)=>{

        var exp = new RegExp(["^", companyTypes[index], "$"].join(""), "i")
        rules.companyType.regex.push(exp);
        companyTypes[index] = exp;

    });

    contactSources.forEach((item,index)=>{

        var exp = new RegExp(["^", contactSources[index], "$"].join(""), "i")
        rules.contactSource.regex.push(exp);
        contactSources[index] = exp;

    });

    var exp = new RegExp(["^.*", rules.companyName.value, ".*$"].join(""), "i");
    rules.companyName.regex = exp;

    exp = new RegExp(["^", rules.industryVertical.value, "$"].join(""), "i");
    rules.industryVertical.regex = exp;

    exp = new RegExp(["^.*", rules.addressPincode.value, ".*$"].join(""), "i");
    rules.addressPincode.regex = exp;

    exp = new RegExp(["^", rules.addressCity.value, "$"].join(""), "i");
    rules.addressCity.regex = exp;

    exp = new RegExp(["^", rules.addressState.value, "$"].join(""), "i");
    rules.addressState.regex = exp;

    exp = new RegExp(["^.*", rules.withContacts_name.value, ".*$"].join(""), "i");
    rules.withContacts_name.regex = exp;

    exp = new RegExp(["^.*", rules.withContacts_designation.value, ".*$"].join(""), "i");
    rules.withContacts_designation.regex = exp;

    rules.createdAt.regex = rules.createdAt.value;

    // delete rules.contactName;
    // delete rules.contactDesignation;
    //
    // exp = new RegExp(["^", contactRules.name.value, "$"].join(""), "i");
    // contactRules.name.regex = exp;
    // exp = new RegExp(["^", rules.contactDesignation.value, "$"].join(""), "i");
    // contactRules.designation.regex = exp;

    rules.employeeCount.regex = rules.employeeCount.value;

    var andFilters = [];
    var orFilters = [];
    console.log("filter array creation");
    for(var filter in rules)
    {
      if(rules[filter].operator == 'and')
      {
        if(rules[filter].type == 'array'){
          var ele = {};
          ele[filter] = { "$in" : rules[filter].regex };
          andFilters.push(ele);
        }
        else if (rules[filter].type=='nested'){
          var ele = {};
          var newFilter  = filter.replace("_",".");

          ele[newFilter] = rules[filter].regex;
          console.log(ele[newFilter].$in);
          andFilters.push(ele);
        }
        else if(rules[filter].type=='range'){
          var ele = {};
          var values = rules[filter].regex.split("-");
          console.log("split values"+values);
          ele[filter] = {"$gte":parseInt(values[0]),"$lt":parseInt(values[1])+1};
          andFilters.push(ele);
        }
        else if(rules[filter].type=='range' && rules[filter].value.includes("+")){
          var ele = {};
          var values = rules[filter].regex.split("+");
          console.log("split values"+values);
          ele[filter] = {"$gte":parseInt(values[0])};
          andFilters.push(ele);
        }
        else if(rules[filter].type=='date'){
          var ele = {};
          var values = rules[filter].regex.split("-");
          var startDate = new Date(rules[filter].regex);
          console.log("start date: "+startDate);
          var endDate = new Date(rules[filter].regex);
          endDate.setDate(endDate.getDate() + 1);
          console.log("end date"+endDate);
          ele[filter] = {"$gte":startDate,"$lt":endDate};
          orFilters.push(ele);
        }
        else {
          var ele = {};
          ele[filter] = rules[filter].regex;
          andFilters.push(ele);
        }
      }
      if(rules[filter].operator == 'or')
      {
        if(rules[filter].type=='array'){
          var ele = {};
          ele[filter] = { "$in" : rules[filter].regex };
          orFilters.push(ele);
        }
        else if (rules[filter].type=='nested'){
          var ele = {};
          var newFilter  = filter.replace("_",".");

          ele[newFilter] = rules[filter].regex;
          console.log(ele[newFilter].$in);
          orFilters.push(ele);
        }
        else if(rules[filter].type=='range'){
          var ele = {};
          var values = rules[filter].regex.split("-");
          console.log("split values"+values);
          ele[filter] = {"$gte":parseInt(values[0]),"$lt":parseInt(values[1])+1};
          orFilters.push(ele);
        }
        else if(rules[filter].type=='range' && rules[filter].value.includes("+")){
          var ele = {};
          var values = rules[filter].regex.split("+");
          console.log("split values"+values);
          ele[filter] = {"$gte":parseInt(values[0])};
          orFilters.push(ele);
        }
        else if(rules[filter].type=='date'){
          var ele = {};
          var values = rules[filter].regex.split("-");
          var startDate = new Date(rules[filter].regex);
          console.log("start date: "+startDate);
          var endDate = new Date(rules[filter].regex);
          endDate.setDate(endDate.getDate() + 1);
          console.log("end date"+endDate);
          ele[filter] = {"$gte":startDate,"$lt":endDate};
          orFilters.push(ele);
        }
        else {
          var ele = {};
          ele[filter] = rules[filter].regex;
          orFilters.push(ele);
        }
      }

    }
    console.log("andFilters :"+andFilters+" | orFilters : "+orFilters);

    var operators = []
    if(orFilters.length > 0)
    {
      operators.push({"$or" : orFilters})
    }
    if(andFilters.length > 0)
    {
      operators.push({"$and" : andFilters})
    }


    if(operators.length > 0)
      {
        console.log("filter passed");
        return Lead.aggregate([
        { "$lookup": {
            "from": "contacts",
            "localField": "_id",
            "foreignField": "lead",
            "as": "withContacts"
        }},
        { $match : { "$and": operators} }

       ]).exec()
        // return Lead.find({ "$and": operators}).exec();
    }
    else {
      console.log("no filter passed");
      return Lead.find({}).exec();
    }

  };

};

exports.profileRepo = new profileRepo();
