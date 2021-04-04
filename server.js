// var vm = require("vm")
// var http = require('http');
// var fs = require('fs');
// var cookie = require('./www/js/cookie.js')
var sql = require('./nodeSql.js')
var path = require('path');
var express = require('express')
var app = express();
var fileUpload = require('express-fileupload');


// DB Creds Access
var Dboptions = require('./options.js');
var loginData = {
    host: Dboptions.storageConfig.host,
    user: Dboptions.storageConfig.user,
    password: Dboptions.storageConfig.password,
    database: Dboptions.storageConfig.database,
}

app.use(fileUpload());

var options = {
    index: 'index.html'
}
app.use(express.static(path.join(__dirname, 'www',), options))
app.post('/login.html', function(req,res) {
    res.redirect('/')
})

sql.dbQuery('SELECT * FROM Cat.Log', loginData )

// app.post('/upload', function(req, res) {
//     // var cookie = req.headers.cookie
//     var cookie = get_cookies(req)['EID']
//     // var cookie = cookie[0].split('=')
//     // console.log(cookie)


//     let sampleFile;
//     let uploadPath;
//     // If there is no files uploaded
//     if (!req.files || Object.keys(req.files).length === 0) {
//         res.redirect('/index.html')

//     }
  
//     // The name of the input field (i.e. "sampleFile") is used to retrieve the uploaded file
//     sampleFile = req.files.sampleFile;
//     var fileExt = sampleFile.name.split('.').pop()
//     if (fileExt == 'jpg' || fileExt == 'png' || fileExt == 'jpeg') {
//         uploadPath = __dirname + '/www/Employee/' + cookie+ "."+ fileExt;
//         // Use the mv() method to place the file somewhere on your server
//         sampleFile.mv(uploadPath, function(err) {
//         if (err)
//             console.log('upload failed')
//         });
//         queryPath = './Employee/' + cookie+ "."+ fileExt
//         sql.dbQuery('Update teamrocket.Binder SET Photo=' + "'" + queryPath + "'" + "WHERE EID=" + "'" + cookie + "'")
//         sql.dbQuery('Select * from Binder WHERE EID = '+ "'" + cookie + "'") 
//         setTimeout(redirectToIndex, 2)
// }
// function redirectToIndex() {
//     res.redirect('/index.html')

// }
    


//   });

//   app.post('/index.html', function(req,res) {
//       res.redirect('/index.html')
//   })

  app.listen(8000, function(err){ 
    if (err) console.log(err); 
    console.log("Server listening on PORT", 8000); 
});  


// var get_cookies = function(request) {
//     var cookies = {};
//     request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
//       var parts = cookie.match(/(.*?)=(.*)$/)
//       cookies[ parts[1].trim() ] = (parts[2] || '').trim();
//     });
//     return cookies;
//   };

