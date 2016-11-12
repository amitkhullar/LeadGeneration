'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.lead',
  'myApp.dashboard',
  'myApp.search',
  'myApp.searchResults',
  'myApp.upload',
  'ngRoute',
  'myApp.version'
])
.constant("myConfig", {
        "url": "http://139.59.24.29"
})
.config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(false);
  $routeProvider.otherwise({redirectTo: '/dashboard/home'});
}])

.controller('MainCntrl', function() {

    this.section = "";

})

.factory('searchFactory',function($http,myConfig){

  var searchFactory = {
    searchResults : [],
    showProgress : false
  }

  return searchFactory;

});
