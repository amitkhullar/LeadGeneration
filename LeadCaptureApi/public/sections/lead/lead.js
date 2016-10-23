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

  vm.getLead = function(){

    console.log("lead : "+vm.leadId);

    $http.get('http://139.59.24.29/api/leads/'+vm.leadId, {}, {})
    .success(function(response){

      // console.log("success"+JSON.parse(response));
      console.log(vm.lead);
      // vm.lead.companyInfo.companyName = response.companyName;


      vm.lead = {
        companyInfo       :  {
                              companyName:response.companyName,currentStatus:response.currentStatus,industryVertical:response.industryVertical,
                              aboutCompany:response.aboutCompany,
                              contactSource:response.contactSource,productsOfInterest:response.productsOfInterest,
                              companyType:response.companyType
                             },

        contacts          :  [{name:"contact 1",designation:"Designation 1", email:"contact1@lead.com", phone : "9999999999"},
                              {name:"contact 2",designation:"Designation 2", email:"contact2@lead.com", phone : "9999999998"}],

        address           :  {
                               building:response.addressBuilding,town:response.addressTownStreet,city:response.addressCity,state:response.addressState,pin:response.addressPincode
                             },

        additionalProfile :  {
                              companyScale:response.companyScale,employeeCnt:response.employeeCount,travelBudget:response.travelBudget,
                              vendorCount:response.vendorCount,vendorHandlingCount:response.vendorHandlerCount,transactionCnt:response.transactionCount,
                              mailingDate: new Date()
                             }

      };

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.saveLead = function(){


  };

  vm.submitLead = function(){

    var data = this.lead;
    var config = {

            };

    console.log(data);
    $http.post('http://139.59.24.29/api/leads', data, config)
    .success(function(){

      console.log("success");

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
      // $location.path() = '/dashboard/home';
      $window.location.href = '/dashboard/home';

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
