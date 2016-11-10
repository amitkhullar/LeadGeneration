'use strict';

angular.module('myApp.search',['ngRoute'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/search', {
    templateUrl: 'public/sections/search/index.html'
  });

}])

.controller('LeadSearchCntrl', function($http,myConfig,searchFactory) {

    var search = {



    };

    var vm = this;
    vm.searchText = "";

    vm.filters = { rules : {
        companyName : {value:"",operator:"",regex:""},
        addressPincode : {value:"",operator:"",regex:""},
        addressCity:{value:"",operator:"",regex:""},
        addressState:{value:"",operator:"",regex:""},
        industryVertical : {value:"",operator:"",regex:""},
        companyType : {value:["smes","startups","mnc","enterprise"],operator:"",regex:[]},
        contactSource : {value:["linkedin","naukri","directory","others","employees"],operator:"",regex:[]},
        employeeCount : {value:"",operator:"",regex:""}
    }};

    vm.companyTypeFilter = function(lead){

        // console.log("lead.companyType:"+lead.companyType);
        if(vm.filters.rules.companyType.value.indexOf(lead.companyType.toLowerCase()) > -1)
        {
          return true;
        }

    }

    vm.selectCheckbox = function($event,checkboxType){

        if(vm.filters.rules[checkboxType].value.length == 0){

          vm.filters.rules[checkboxType].value.push($event.target.value);

        }
        else if (vm.filters.rules[checkboxType].value.indexOf($event.target.value) > -1){
          var index = vm.filters.rules[checkboxType].value.indexOf($event.target.value);
          vm.filters.rules[checkboxType].value.splice(index,1);
          // vm.filters.companyType = vm.filters.companyType.replace($event.target.value,"");
        }
        else {
          vm.filters.rules[checkboxType].value.push($event.target.value);
        }

        console.log(vm.filters.rules[checkboxType].value);


    }

    vm.selectOperator = function($event,alt){

      console.log($(event.target).attr('class'));
      if($(event.target).attr('id').indexOf('and') > -1)
      {
        if($(event.target).attr('class').indexOf('success') > -1)
        {
            $(event.target).removeClass('btn btn-success btn-circle');
            $(event.target).addClass('btn btn-primary btn-circle');
            vm.filters.rules[$(event.target).attr('value')].operator = "";
        }
        else {
          $(event.target).removeClass('btn btn-primary btn-circle');
          $(event.target).addClass('btn btn-success btn-circle');
          vm.filters.rules[$(event.target).attr('value')].operator = "and";
          if(document.getElementById(alt).getAttribute('class').indexOf('success') > -1){

            document.getElementById(alt).setAttribute('class','btn btn-warning btn-circle');
          }
        }
      }
      else if($(event.target).attr('id').indexOf('or') > -1){
        if($(event.target).attr('class').indexOf('success') > -1)
        {
            $(event.target).removeClass('btn btn-success btn-circle');
            $(event.target).addClass('btn btn-warning btn-circle');
            vm.filters.rules[$(event.target).attr('value')].operator = "";
        }
        else {
          $(event.target).removeClass('btn btn-warning btn-circle');
          $(event.target).addClass('btn btn-success btn-circle');
          vm.filters.rules[$(event.target).attr('value')].operator = "or";
          if(document.getElementById(alt).getAttribute('class').indexOf('success') > -1){

            document.getElementById(alt).setAttribute('class','btn btn-primary btn-circle');
          }
        }
      }

    }

    vm.searchLeads = function(){

      var data = vm.filters;
      console.log(data);
      searchFactory.searchResults = [];
      searchFactory.showProgress = true;
      $http.post(myConfig.url+"/api/leads/search",data,{})
      .success(function (response, status, headers) {

          console.log("data "+response);
          searchFactory.searchResults = response;
          searchFactory.searchInitiated = true;
          searchFactory.showProgress = false;
      })
      .error(function(err){

        searchFactory.showProgress = false;

      });

    };


    // $(document).ready(function(){
    //
    //   vm.searchLeads();
    //
    // })

    $("#searchLink").click(function(){

      vm.searchLeads();

    });




});
