'use strict';

angular.module('myApp.search',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/testSearch', {
    templateUrl: 'public/sections/search/index.html',
    controller: 'LeadSearchCntrl'
  });

}])

.controller('LeadSearchCntrl', function($http) {

    var search = {



    };

    var vm = this;
    vm.searchText = "";
    vm.searchResults = [];
    vm.filters = {
        companyName : "",
        addressPincode : "",
        city:"",
        state:"",
        industryVertical : "",
        companyType : "",
        contactSource : "",
        employeeCount : ""
    };

    vm.selectCompanyType = function($event){

      if(vm.filters.companyType == ""){

        vm.filters.companyType += $event.target.value;

      }
      else if (vm.filters.companyType.includes($event.target.value)){
        vm.filters.companyType = vm.filters.companyType.replace($event.target.value,"");
      }
      else {
        vm.filters.companyType += $event.target.value;
      }

      console.log("curr"+vm.filters.companyType);



    }

    vm.getLeads = function(){

      var data = this.search;
      var config = {

              };

      $http.get("http://139.59.24.29/api/leads")
      .then(function(response) {

          console.log("data "+response.data);
          vm.searchResults = response.data;

      });

    };

    vm.getLeads();


});
