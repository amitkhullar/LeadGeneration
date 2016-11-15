'use strict';

// Declare app level module which depends on views, and components
angular.module('myApp', [
  'myApp.lead',
  'myApp.dashboard',
  'myApp.search',
  'myApp.searchResults',
  'myApp.upload',
  'ngRoute',
  'myApp.version',
  'myApp.login'
])
.constant("myConfig", {
        "url": "http://localhost:8005"
})
.config(['$locationProvider','$routeProvider', function($locationProvider,$routeProvider) {
  $locationProvider.hashPrefix('!');
  $locationProvider.html5Mode(false);
  $routeProvider
  .when('/leads/search', {
    templateUrl: 'public/sections/search/index.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }
  })
  .when('/login', {
    templateUrl: 'public/sections/login/index.html'

  })
  .when('/leads/:leadId/edit',{
    templateUrl: 'public/sections/lead/manage.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }

  }).when('/leads/:leadId/view',{
    templateUrl: 'public/sections/lead/manage.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }

  }).when('/leads',{
    templateUrl: 'public/sections/lead/index.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }

  })
  .when('/leads/:leadId/delete',{
    templateUrl: 'public/sections/lead/manage.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }

  })
  .when('/leads/create', {
    templateUrl: 'public/sections/lead/manage.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }

  })
  .when('/dashboard/home', {
    templateUrl: 'public/sections/dashboard/index.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }
  })
  .when('/leads/upload', {
    templateUrl: 'public/sections/upload/index.html',
    auth : function(user){

      console.log("auth"+user);
      return user && user.userId;

    }
  })
  .otherwise({redirectTo: '/login'});
}])
.run(function ($rootScope, $location) {
  $rootScope.$on('$routeChangeStart', function (ev, next, curr) {
    if (next.$$route) {
      var user = $rootScope.user;
      var auth = next.$$route.auth
      if (auth && !auth(user)) { $location.path('/login') }
    }
  })
})
.factory('commonData',function($http,myConfig){

  var commonData = {
    searchResults : [],
    showProgress : false,
    userData : {userId:"",name:"",isLoggedIn:false}

  }

  return commonData;

})
.controller('MainCntrl', function($scope,commonData,$rootScope,$location) {

    var vm = this;

    vm.section = "";
    vm.isLoggedIn = false;
    vm.username = "";

    vm.logout = function() {
      $rootScope.user = {};
      vm.isLoggedIn = false;
      $location.path('/login');
    }

    $scope.$watch(function () { return commonData.userData.isLoggedIn }, function (newValue, oldValue) {
        if (newValue !== oldValue)
        {

          vm.isLoggedIn = newValue;
          console.log("logged in state : "+vm.isLoggedIn);
        }
    });

    $scope.$watch(function () { return commonData.userData.name }, function (newValue, oldValue) {
        if (newValue !== oldValue)
        {

          vm.username = newValue;
        }
    });


});
