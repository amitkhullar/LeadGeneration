'use strict';



angular.module('myApp.lead',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {

  $routeProvider.when('/leads/create', {
    templateUrl: 'public/sections/lead/manage.html',
    controller: 'LeadFormCntrl'

  }).when('/leads/:leadId/edit',{
    templateUrl: 'public/sections/lead/manage.html',
    controller: 'LeadFormCntrl'

  }).when('/leads/:leadId/view',{
    templateUrl: 'public/sections/lead/manage.html',
    controller: 'LeadFormCntrl'

  }).when('/leads',{
    templateUrl: 'public/sections/lead/index.html',
    controller: 'LeadFormCntrl'

  })
  .when('/leads/:leadId/delete',{
    templateUrl: 'public/sections/lead/manage.html',
    controller: 'LeadFormCntrl'

  });

}])

.controller('LeadFormCntrl', function($http,$routeParams,$location,$window) {

  var vm = this;
  var path = $location.path().split('/');

  vm.operation = path[path.length-1];
  vm.searchResults = [];
  console.log("path : "+path[path.length-1]);

  if(vm.operation == 'create')
  {
      console.log("create section");
      vm.lead = {
        companyInfo       :  {
                              companyName:"Test data",currentStatus:"Email Sent",industryVertical:"BFSI",
                              aboutCompany:"Test description",
                              contactSource:"Naukri",productsOfInterest:"Test Product",
                              companyType:"Startups"
                             },

        contacts          :  [{name:"contact 1",designation:"Designation 1", email:"contact1@lead.com", phone : "9999999999"},
                              {name:"contact 2",designation:"Designation 2", email:"contact2@lead.com", phone : "9999999998"}],

        address           :  {
                               building:"building1",town:"town1",city:"New delhi",state:"Delhi",pin:"110018"
                             },

        additionalProfile :  {
                              companyScale:"scale1",employeeCnt:"10000",travelBudget:"3243243",
                              vendorCount:"1000",vendorHandlingCount:"100",transactionCnt:"200000000",
                              mailingDate: new Date()
                             }

      };
   }



   vm.getLeads = function(){

     console.log("lfc leads");
     var data = this.search;
     var config = {};

     $http.get("http://139.59.24.29/api/leads")
     .then(function(response) {

         console.log("data "+response.data);
         vm.searchResults = response.data;

     });

   };

   if(vm.operation == "leads"){

     vm.getLeads();

   }

  vm.getLead = function(){

    console.log("lead : "+vm.leadId);

    $http.get('http://139.59.24.29/api/leads/'+vm.leadId, {}, {})
    .success(function(response){

      // console.log("success"+JSON.parse(response));
      console.log("response : "+response);
      console.log("contacts : "+response.contacts);
      // vm.lead.companyInfo.companyName = response.companyName;


      vm.lead = {
        companyInfo       :  {
                              companyName:response.lead.companyName,currentStatus:response.lead.currentStatus,industryVertical:response.lead.industryVertical,
                              aboutCompany:response.lead.aboutCompany,
                              contactSource:response.lead.contactSource,productsOfInterest:response.lead.productsOfInterest,
                              companyType:response.lead.companyType
                             },

        contacts          :  response.contacts,

        address           :  {
                               building:response.lead.addressBuilding,town:response.lead.addressTownStreet,city:response.lead.addressCity,state:response.lead.addressState,pin:response.lead.addressPincode
                             },

        additionalProfile :  {
                              companyScale:response.lead.companyScale,employeeCnt:response.lead.employeeCount,travelBudget:response.lead.travelBudget,
                              vendorCount:response.lead.vendorCount,vendorHandlingCount:response.lead.vendorHandlerCount,transactionCnt:response.lead.transactionCount,
                              mailingDate: new Date()
                             }

      };

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.saveLead = function(){

    var data = vm.lead;
    console.log(data);

    $http.put('http://139.59.24.29/api/leads/'+vm.leadId,data,{})
     .success(function (response, status, headers) {
         vm.ServerResponse = response;
     })
     .error(function (response, status, header, config) {
         vm.ServerResponse = {"message":"Error updating lead"};
     });

  };

  vm.submitLead = function(){

    var data = vm.lead;
    var config = {

            };

    console.log(data);
    $http.post('http://139.59.24.29/api/leads', data, config)
    .success(function(){

      console.log("success");
      $window.location.href = '#!/dashboard/home';

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.deleteLead = function(){

    var leadId = $("#leadToDelete").val();
    console.log("start deletion"+leadId);

    $http.delete('http://139.59.24.29/api/leads/'+leadId, {})
    .success(function(){

      console.log("delete success");
      // $location.path() = '#!/dashboard/home';
      $window.location.href = '#!/dashboard/home';
      // vm.getLeads();

    })
    .error(function(){

      console.log("error");

    });
  };


  if(vm.operation == 'edit'){

    vm.leadId = $routeParams.leadId;
    console.log("param : "+vm.leadId);
    vm.getLead();

  }
  else if(vm.operation == "view") {

    console.log("leadid : "+$routeParams.leadId);
    vm.operation = "view";
    vm.leadId = $routeParams.leadId;
    vm.getLead();

  }
  else if(vm.operation == "delete") {
    vm.operation = "delete";
    vm.leadId = $routeParams.leadId;
    vm.deleteLead();
  }


});
