'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.lead',
  'myApp.dashboard',
  'myApp.search',
  'myApp.upload',
  'ngRoute',
  'myApp.version'
  ,'angularUUID2'
])
.constant("myConfig", {
        "url": "http://localhost:8005"
})
.config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(false);
  $routeProvider.otherwise({redirectTo: '/dashboard/home'});
}])

.controller('MainCntrl', function() {

    this.section = "";

})

.factory('commonBehaviors',function($http,myConfig){

  var gridFactory = {};





  return gridFactory;

});
