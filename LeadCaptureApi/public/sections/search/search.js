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

    vm.selectCompanyType = function(obj){

      vm.filters.companyType = obj.value;
      console.log("curr"+obj.value);
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
