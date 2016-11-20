'use strict';

angular.module('myApp.search',['ngRoute'])
.controller('LeadSearchCntrl', function($http,myConfig,commonData,$scope) {

    var vm = this;
    vm.filters = { rules : {
        companyName : {value:"",operator:"",regex:"",type:"string"},
        addressPincode : {value:"",operator:"",regex:"",type:"string"},
        addressCity:{value:"",operator:"",regex:"",type:"string"},
        addressState:{value:"",operator:"",regex:"",type:"string"},
        industryVertical : {value:"",operator:"",regex:"",type:"string"},
        companyType : {value:["smes","startups","mnc","enterprise"],operator:"",regex:[],type:"array"},
        contactSource : {value:["linkedin","naukri","directory","others","employees"],operator:"",regex:[],type:"array"},
        employeeCount : {value:"",operator:"",regex:"",type:"range"},
        withContacts_name : {value:"",operator:"",regex:"",type:"nested"},
        withContacts_designation : {value:"",operator:"",regex:"",type:"nested"},
        createdAt : {value:"",operator:"",regex:"",type:"date"}
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
;
    vm.searchLeads = function(){

      var data = vm.filters;
      console.log(data);
      commonData.searchResults = [];
      commonData.showProgress = true;
      // if(data.rules.createdAt.value)
      // {
      //   data.rules.createdAt.value.setDate(data.rules.createdAt.value.getDate() + 1);
      //   console.log(data.rules.createdAt.value);
      // }
      $http.post(myConfig.url+"/api/leads/search",data,{})
      .success(function (response, status, headers) {

          console.log("data "+response);
          commonData.searchResults = response;
          commonData.showProgress = false;
      })
      .error(function(err){

        commonData.showProgress = false;

      });

    };


    $(document).ready(function(){

      vm.searchLeads();

    })

    $("#searchLink").click(function(){

      vm.searchLeads();

    })




});
