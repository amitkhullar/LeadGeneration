'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.lead',
  'myApp.dashboard',
  'myApp.search',
  'ngRoute',
  'myApp.version'
])
.constant("myConfig", {
        "url": "http://localhost",
        "port": "8005"
})
.config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(false);
  $routeProvider.otherwise({redirectTo: '/dashboard/home'});



}])

.controller('MainCntrl', function() {

    this.section = "";

})

.controller('TopBarCntrl', function() {


});
