'use strict';

angular.module('myApp.search',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/search', {
    templateUrl: 'sections/search',
    controller: 'LeadSearchCntrl'
  });

}])

.controller('LeadSearchCntrl', function($scope,$http) {

    var search = {



    };

    $scope.searchResults = [];



    $scope.getLeads = function(){

      var data = this.search;
      var config = {

              };

      $http.get("http://localhost:8005/api/leads")
      .then(function(response) {

          console.log("data "+response.data);
          $scope.searchResults = response.data;

      });

    };

    $scope.getLeads();


});
