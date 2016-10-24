'use strict';

angular.module('myApp.dashboard',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard/home', {
    templateUrl: 'public/sections/dashboard/index.html',
    controller: 'DashboardCntrl'
  });
}])
.controller('DashboardCntrl', function()
{

  var vm = this;

  vm.leadStats = {

    new_leads : 0,
    leads_responded : 0,
    pending_action : 0

  }

  vm.getLeadStatistics = function(){

    $http.get('http://139.59.24.29/api/leads/stats', data, config)
    .success(function(response){

      console.log("success"+response);
      vm.leadStats = response;

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.getLeadStatistics();




});
