'use strict';

angular.module('myApp.login',['ngRoute'])

.controller('LoginCntrl', function($http,myConfig,commonData,$window,$rootScope)
{
  var vm = this;
  vm.tab = '#form-login';
  vm.responseMessage = "";
  vm.signupResponseMessage = "";
  vm.isValid = true;
  vm.validations = {login : {email : true,password:true,isValid:true},signup : {fname:true, lname:true, email:true, password : true, isValid:true}};

  vm.credentials = {email : "", password : ""};
  vm.userDetails = {fname : "",lname : "",email : "", password : ""};


  vm.login = function(){

    vm.validations.login.email = !vm.credentials.email == "";
    vm.validations.login.password = !vm.credentials.password == "";


    if(!vm.validations.login.email || ! vm.validations.login.password)
      vm.validations.login.isValid = false;
    else {
      vm.validations.login.isValid = true;
    }

    if(vm.validations.login.isValid)
    {
      console.log("submitted");
      $http.post(myConfig.url+"/api/auth/signin",{credentials : vm.credentials},{})
      .success(function (response, status, headers) {

        commonData.userData.userId = response.userId;
        commonData.userData.name = response.name;
        commonData.userData.isLoggedIn = true;
        $rootScope.user = response;
        $window.location.href = '#!/dashboard/home';
      })
      .error(function(err){

        vm.responseMessage = err.error;

      });
    }

  };

  vm.signup = function(){

    vm.validations.signup.email = !vm.userDetails.email == "";
    vm.validations.signup.password = !vm.userDetails.password == "";
    vm.validations.signup.fname = !vm.userDetails.fname == "";
    vm.validations.signup.lname = !vm.userDetails.lname == "";


    if(!vm.validations.signup.email || !vm.validations.signup.password || !vm.validations.signup.lname || !vm.validations.signup.fname)
      vm.validations.signup.isValid = false;
    else {
      vm.validations.signup.isValid = true;
    }

    if(vm.validations.signup.isValid)
    {
        $http.post(myConfig.url+"/api/auth/signup",{userDetails : vm.userDetails},{}).then(
        function (response, status, headers) {

          commonData.userData.userId = response.data.userId;
          commonData.userData.name = response.data.name;
          commonData.userData.isLoggedIn = true;
          $rootScope.user = response.data;
          $window.location.href = '#!/dashboard/home';

        },
        function(err){

          console.log(err.data.error);
          vm.signupResponseMessage = err.data.error;

        });
    }

};

});
