'use strict';

angular.module('myApp.dashboard',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard/home', {
    templateUrl: 'public/sections/dashboard/index.html',
    controller: 'DashboardCntrl'
  });
}])
.controller('DashboardCntrl', function($http)
{

  var vm = this;

  vm.leadStats = {

    new_leads : 0,
    leads_responded : 0,
    pending_action : 0

  }

  vm.searchResults = [];

  vm.getLeadStatistics = function(){

    $http.get('http://139.59.24.29/api/leads/stats', {}, {})
    .success(function(response){

      console.log("success"+response);
      vm.leadStats = response;

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.getLeadStatistics();

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
