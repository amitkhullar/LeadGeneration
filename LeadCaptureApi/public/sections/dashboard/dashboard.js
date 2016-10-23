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

});
