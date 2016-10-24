'use strict';

angular.module('myApp.search',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/testSearch', {
    templateUrl: 'public/sections/search/index.html',
    controller: 'LeadSearchCntrl'
  });

}])

.controller('LeadSearchCntrl', function($scope,$http) {

    var search = {



    };

    $scope.searchResults = [];
    $scope.selectedLead= "";


    $scope.getLeads = function(){

      var data = this.search;
      var config = {

              };

      $http.get("http://139.59.24.29/api/leads")
      .then(function(response) {

          console.log("data "+response.data);
          $scope.searchResults = response.data;

      });

    };

    $scope.getLeads();


});
