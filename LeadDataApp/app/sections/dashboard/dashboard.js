'use strict';

angular.module('myApp.dashboard',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/dashboard/home', {
    templateUrl: 'sections/dashboard',
    controller: 'DashboardCntrl'
  });
}])
.controller('DashboardCntrl', function()
{

});
