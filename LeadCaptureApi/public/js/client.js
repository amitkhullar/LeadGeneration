// var socket = io.connect('http://139.59.24.29/api/uploads');
//
// // if we get an "info" emit from the socket server then console.log the data we recive
//
// socket.on('progress-report',function(data){
//
//   console.log(data);
//   $("#processingProgress").html("").html("Processed :"+data.progress + ' records...');
//   // if(data.progress < 100)
//   // {
//
//     socket.emit('get-progress');
//
//
//   // }
//
//
// });
//
//
// socket.on('info', function (data) {
//     console.log(data);
//
//
//     $('#file').change(function(e) {
//       var file = e.target.files[0];
//       var stream = ss.createStream();
//       console.log("on change"+file.name);
//       // upload a file to the server.
//       ss(socket).emit('start-upload', stream, {name: file.name});
//
//       var blobStream = ss.createBlobReadStream(file);
//       var size = 0;
//       var uploadProgress = 0;
//       blobStream.on('data', function(chunk) {
//         size += chunk.length;
//         uploadProgress = Math.floor(size / file.size * 100);
//         console.log(uploadProgress + '%');
//         $("#uploadProgress").html("").html("Uploaded :"+uploadProgress + '%');
//
//         // ss(socket).emit('start-processing', stream, {name: file.name});
//         if(uploadProgress == 100){
//           socket.emit('get-progress');
//           socket.emit('start-processing');
//
//         }
//
//         // -> e.g. '42%'
//       });
//
//       blobStream.pipe(stream);
//
//     });
//
// });
