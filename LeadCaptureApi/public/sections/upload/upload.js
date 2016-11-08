'use strict';

angular.module('myApp.upload',['ngRoute','ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/upload', {
    templateUrl: 'public/sections/upload/index.html',
    controller: 'UploadCntrl'
  });

}])



.controller('UploadCntrl',function ($scope, $timeout,Upload) {
    $scope.uploadFiles = function(file, errFiles) {
        $scope.f = file;
        $scope.errFile = errFiles && errFiles[0];
        if (file) {
            file.upload = Upload.upload({
                url: 'https://angular-file-upload-cors-srv.appspot.com/upload',
                data: {file: file}
            });

            file.upload.then(function (response) {
                $timeout(function () {
                    file.result = response.data;
                });
            }, function (response) {
                if (response.status > 0)
                    $scope.errorMsg = response.status + ': ' + response.data;
            }, function (evt) {
                file.progress = Math.min(100, parseInt(100.0 *
                                         evt.loaded / evt.total));
            });
          }
        }
      });
