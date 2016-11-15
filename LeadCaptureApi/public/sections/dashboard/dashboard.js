'use strict';

angular.module('myApp.dashboard',['ngRoute'])

.controller('DashboardCntrl', function($http,myConfig)
{

  var vm = this;

  vm.leadStats = {

    new_leads : 0,
    leads_responded : 0,
    pending_action : 0

  }
  vm.showProgress = false;
  vm.toggle = function(e){

    if(vm[e.currentTarget.id] == '-')
    {
      vm[e.currentTarget.id] = '';
    }
    else {
      vm[e.currentTarget.id] = '-';
    }

  };

  vm.getLeadStatistics = function(){

    $http.get(myConfig.url+'/api/leads/stats', {}, {})
    .success(function(response){

      console.log("success"+response);
      vm.leadStats = response;

    })
    .error(function(){

      console.log("error");

    });

  };

  vm.getLeadStatistics();


  vm.searchResults = [];


  vm.getLeads = function(){
    vm.showProgress = true;
    var data = this.search;
    var config = {

            };

    $http.get(myConfig.url+"/api/leads")
    .then(function(response) {

        console.log("data "+response.data);
        vm.searchResults =  response.data;
        vm.showProgress = false;

    });

  };

  vm.getLeads();



});
