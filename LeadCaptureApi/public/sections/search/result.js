'use strict';

angular.module('myApp.searchResults',[])

.controller('searchResultsCntrl', function($scope,searchFactory) {

    $scope.searchResults = [];
    $scope.searchInitiated = false;
    $scope.showProgress = true;

    $scope.$watch(function () { return searchFactory.searchResults }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.searchResults = newValue;
    });

    $scope.$watch(function () { return searchFactory.searchInitiated }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.searchInitiated = newValue;
    });

    $scope.$watch(function () { return searchFactory.showProgress }, function (newValue, oldValue) {
        if (newValue !== oldValue) $scope.showProgress = newValue;
    });


});