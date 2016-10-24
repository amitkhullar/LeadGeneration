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
        companyType : ["smes","startups","mnc"],
        contactSource : "",
        employeeCount : ""
    };

    vm.companyTypeFilter = function(lead){

        console.log(lead.companyType);
        if(vm.filters.companyType.indexOf(lead.companyType.toLowerCase()) > -1)
        {
          return true;
        }

    }

    vm.selectCompanyType = function($event){

      if(vm.filters.companyType.length == 0){

        vm.filters.companyType.push($event.target.value);

      }
      else if (vm.filters.companyType.indexOf($event.target.value) > -1){
        var index = vm.filters.companyType.indexOf($event.target.value);
        vm.filters.companyType.splice(index,1);
        // vm.filters.companyType = vm.filters.companyType.replace($event.target.value,"");
      }
      else {
        vm.filters.companyType.push($event.target.value);
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
