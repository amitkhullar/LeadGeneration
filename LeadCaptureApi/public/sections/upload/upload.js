'use strict';

angular.module('myApp.upload',['ngRoute','ngFileUpload'])

.config(['$routeProvider', function($routeProvider) {
  $routeProvider.when('/leads/upload', {
    templateUrl: 'public/sections/upload/index.html'
  });

}])



.controller('UploadCntrl',function (myConfig) {

  var socket = io.connect(myConfig.url);
  var vm = this;
  vm.showDuplicate = false;

  socket.on('progress-report',function(data){

    console.log(data);
    $("#processingProgress").html("").html("Processed :"+data.message.processed + ' records...');
    if(data.message.duplicate)
    {
      $("#duplicate").html("").html(data.message.duplicate + ' duplicate records...');
    }
    socket.emit('get-progress');


  });

  socket.on('connect',function () {
    console.log("connected for uploads");
    $('#file').change(function(e) {
      var file = e.target.files[0];
      var stream = ss.createStream();
      console.log("on change"+file.name);
      // upload a file to the server.
      ss(socket).emit('start-upload', stream, {name: file.name});

      var blobStream = ss.createBlobReadStream(file);
      var size = 0;
      var uploadProgress = 0;
      blobStream.on('data', function(chunk) {
        size += chunk.length;
        uploadProgress = Math.floor(size / file.size * 100);
        console.log(uploadProgress + '%');
        $("#uploadProgress").html("").html("Uploaded :"+uploadProgress + '%');

        // ss(socket).emit('start-processing', stream, {name: file.name});
        if(uploadProgress == 100){
          // socket.emit('get-progress');
          socket.emit('start-processing');

        }

        // -> e.g. '42%'
      });

      blobStream.pipe(stream);

    });

  })






});
