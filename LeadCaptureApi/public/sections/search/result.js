'use strict';

angular.module('myApp.searchResults',[])

.controller('searchResultsCntrl', function($scope,commonData) {

    $scope.searchResults = [];
    $scope.showProgress = true;

    $scope.$watch(function () { return commonData.searchResults }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.searchResults = newValue;

    });


    $scope.$watch(function () { return commonData.showProgress }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.showProgress = newValue;
    });


});
