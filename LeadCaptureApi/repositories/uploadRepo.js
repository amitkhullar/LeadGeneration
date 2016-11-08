const Lead = require('../models/lead');
const Contact = require('../models/contact');
const profileRepo = require('./profileRepo').profileRepo;
var Excel = require('exceljs');

var uploadRepo = function(){

var ctx = this;
this.filename = "";
this.batchSize = 20;
ctx.server = {};
ctx.progress = 0;
ctx.io = require('socket.io')(ctx.server);
ctx.socket = {};
this.process = function(){

  var workbook = new Excel.Workbook();
  workbook.xlsx.readFile(this.filename)
  .then(()=>{

    var worksheet = workbook.getWorksheet('profiles');


    worksheet.eachRow({ includeEmpty: true }, function(row, rowNumber) {

        // console.log(rowNumber);
        if(rowNumber > 1){


          var leadData = {
                        companyInfo       :  {
                                              companyName:"",currentStatus:"",industryVertical:"",
                                              subIndustryVertical:"",aboutCompany:"",
                                              contactSource:"",
                                              companyType:"",
                                              companyScale:"",employeeCnt:""
                                             },

                        contacts          :  [],

                        address           :  {
                                              building:"",town:"",city:"",state:"",pin:""
                                             }

                      };
          leadData.companyInfo.companyName          =   row.getCell(3).value;
          leadData.companyInfo.industryVertical     =   row.getCell(4).value;
          leadData.companyInfo.aboutCompany         =   row.getCell(5).value;
          leadData.companyInfo.contactSource        =   row.getCell(6).value;
          leadData.companyInfo.companyType          =   row.getCell(7).value;
          leadData.companyInfo.companyScale         =   row.getCell(8).value;
          leadData.companyInfo.employeeCnt          =   row.getCell(9).value;
          leadData.address.building                 =   row.getCell(10).value;
          leadData.address.town                     =   row.getCell(11).value;
          leadData.address.city                     =   row.getCell(12).value;
          leadData.address.state                    =   row.getCell(13).value;
          leadData.address.pin                      =   row.getCell(14).value;


          for(var i=0;i<5;i++)
          {

            if(row.getCell(15+(i*5)+0).value!="")
            {
              var contact = {name:"",designation:"",email:"",landline:[],mobile:[]};
              console.log("contact name : "+row.getCell(15+(i*5)+0).value);
              contact.name          = row.getCell(15+(i*5)+0).value;
              contact.designation   = row.getCell(15+(i*5)+1).value;
              contact.email         = row.getCell(15+(i*5)+2).value;
              if(row.getCell(15+(i*5)+3).value)
                contact.landline.push({"number":row.getCell(15+(i*5)+3).value});
              if(row.getCell(15+(i*5)+4).value)
                contact.mobile.push({"number":row.getCell(15+(i*5)+4).value});
              leadData.contacts.push(contact);
            }
          }

          // console.log("lead"+leadData.companyInfo.companyName);

          profileRepo.insert(leadData);
          ctx.progress = rowNumber;
          ctx.socket.emit('progress-report',{ "progress": parseInt(ctx.progress)});
          // console.log(ctx.progress);

        }

    });

  });

};


};

exports.uploadRepo = new uploadRepo();
