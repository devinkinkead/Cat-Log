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




app.post('/upload', function(req, res) {
    var vomit = 0
    var name = ""
    var amount = 0

    var data = {}
    try {
        vomit = req.body.vomit
        if (vomit == undefined) {
            vomit = 0
        }
        
    }
    catch {
        console.log('Unchecked')
    }
    // console.log("vomit: " + vomit)
    // console.log('Name: ' + req.body.petName)
    // console.log("Amount: " + req.body.amount)

    data['vomit'] = vomit
    data['name'] = req.body.petName
    data['amount'] = req.body.amount
    data['notes'] = req.body.notes
    //  console.log(data)
    let query = "INSERT INTO Cat.Log (Pet_Name, User, Date, Amount, Vomit, Notes) VALUES(" + "'" + data['name'] + "'" +"," + "'" + "dkinkead" + "'" + "," + "now()" + "," + "'" 
    + data['amount'] + "'" + "," + "'" + data['vomit'] + "'" + "," + "'" + data['notes'] + "'" + ");" 
    sql.dbQuery(query, loginData)
    res.redirect('/index.html')
});


app.get('/petData', function(req, res){
    let query = "SELECT Pet from Cat.Pets WHERE Owner = 'dkinkead'"
    let data = sql.dbQuery(query, loginData)
    // console.log('test: '+ data)
    data.then( (value) => {
        // console.log('yo ' + JSON.stringify(value))
        return res.json(JSON.stringify(value))   
    }
    )

    
    // res.json(); //also tried to do it through .send, but there data only on window in browser
});


app.get('/Stats', function(req, res) {
    let query = "SELECT Date, Pet_Name, Notes, Amount, Vomit from Cat.Log WHERE User = 'dkinkead' AND pet_Name='Honda'"
    let data = sql.dbQuery(query, loginData)
    // console.log('test: '+ data)
    data.then( (value) => {
        // console.log('yo ' + JSON.stringify(value))
        return res.json(JSON.stringify(value))   
    }
    )
    
    
})


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

  app.listen(3000, function(err){ 
    if (err) console.log(err); 
    console.log("Server listening on PORT", 3000); 
});  



