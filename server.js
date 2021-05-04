// var vm = require("vm")
// var http = require('http');
// var fs = require('fs');
var sql = require('./nodeSql.js')
var path = require('path');
var express = require('express')
var app = express();
var fileUpload = require('express-fileupload');
const accountManager = require('./acctManagement.js')

// DB Creds Access
var Dboptions = require('./options.js');
var loginData = {
    host: Dboptions.storageConfig.host,
    user: Dboptions.storageConfig.user,
    password: Dboptions.storageConfig.password,
    database: Dboptions.storageConfig.database,
    ssl:  {
        ca: Dboptions.storageConfig.cert
    }
}




app.use(fileUpload());

var options = {
    index: 'login.html'
}
var publicDirectory = path.join(__dirname, 'www/')

app.use(express.static(publicDirectory, options))
app.use(express.urlencoded({ extended: false }));



// sql.dbQuery('SELECT * FROM Cat.Log', loginData )



// From Feeding Form
app.post('/upload', async function(req, res) {
    valid = await loginCheck(req)
    if (valid == 1) {
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
            // console.log('Unchecked')
        }
        // console.log("vomit: " + vomit)
        // console.log('Name: ' + req.body.petName)
        // console.log("Amount: " + req.body.amount)

        data['vomit'] = vomit
        data['name'] = req.body.petName
        data['amount'] = req.body.amount
        data['notes'] = req.body.notes
        //  console.log(data)
        let query = "INSERT INTO Cat.Log (Pet_ID, User_ID, Date, Amount, Vomit, Notes) VALUES(" + "'" + data['name'] + "'" +"," + "'" + "dkinkead" + "'" + "," + "now()" + "," + "'" 
        + data['amount'] + "'" + "," + "'" + data['vomit'] + "'" + "," + "'" + data['notes'] + "'" + ");" 
        sql.dbQuery(query, loginData)
        }
    
    res.redirect('/feedingForm')
});

app.post('/WeightUpload', async function(req, res) {
    let valid = await loginCheck(req)

    if (valid == 1) {
        let pet = req.body.petName
        let weight = req.body.weight

        let query = "INSERT INTO Weight_Log(Date, Pet_ID, Weight) VALUES(Now()," + pet + "," + weight + ");"
        sql.dbQuery(query,loginData)
    }
    
    res.redirect('/weightForm')
});

app.get('/WeightHistory', async function(req, res) {
    let valid = await loginCheck(req)

    if (valid == 1) {
        let pet = ''
        try {
            pet = get_cookies(req)['Pet_ID']

        }
        catch (TypeError) {
            pet = ''
        }

        let query = "SELECT Date, Weight FROM Weight_Log WHERE Pet_ID=" + pet + " ORDER BY Date ASC"
        let data = await sql.dbQuery(query,loginData)
        return res.json(JSON.stringify(data))
    }
    else {
        return res.json(JSON.stringify({'invalid': true}))
    }
    

});
app.post('/login', async function(request, res) {
    let yourPassword = request.body.pwd;
    let userName = request.body.username
    // PW in DB
    let authenticate = accountManager.authenticate(userName, yourPassword, sql, loginData)
    
    if (await authenticate == 0) {
        var cookieOptions =  {
            maxAge:1000*60*15, // expire in 15 minutes
            httpOnly:true
        }
        let userID = await sql.dbQuery('Select ID from Owners where name='+ "'" + userName + "'", loginData)
        userID = JSON.parse(JSON.stringify(userID))
        userID= userID[0]['ID']
        let accountID = await sql.dbQuery('Select ID from Accounts where user='+ "'" + userName + "';", loginData)
        accountID= accountID[0]['ID']


        let crypto = await accountManager.sessionCreator(accountID, sql, loginData)
        if (crypto == 2 ) {
            res.send('Authenication Failed - Session could not be created')
        }
        else {
            res.cookie('token', crypto, cookieOptions)
        }

        res.cookie('user',userID, cookieOptions)
        res.redirect('/feedingForm')
    }
    else if (await authenticate == 1) {
      res.send('Authentication Failed')
    }
    else {
      res.send('Authentication Failed')
    }
    
    
    });
    

app.get('/signOut', async function(req,res) {
res.clearCookie('token')
res.clearCookie('Pet_ID')
res.clearCookie('user')

res.redirect('/')
});

    
    
    
    
    // app.post('/createAccount', async function(request,res) {
    //   // console.log(request.body)
    //   let password = request.body.pwd;
    //   let userName = request.body.user;
      
    //   // let created = accountManager.createAccount(userName, password, sql, loginData)
    //     // console.log(userName, password)
      
    //     let created = await accountManager.createAccount(userName, password, sql, loginData)
    //     // console.log(created)
    //     if (created == 1) {
    //       res.send('Account Already Exists')
    //     }
    //     else if (created == 0) {
    //       res.send('Account Created')
    //     }
    //     else {
    //       res.send('Account Creation Failed')
    //     }
    
    // });


app.get('/petStats', async function(req, res) {
    let valid = await loginCheck(req)

    if (valid == 1) {
            // Get the petName from cookie
        let pet = ''
        try {
            pet = get_cookies(req)['Pet_ID']

        }
        catch (TypeError) {
            pet = ''
        }

        // console.log(pet)
        let query = "SELECT Date, Pets.Pet AS Pet_Name, Notes, Amount, Vomit from Pets INNER JOIN Log ON Pets.ID = Log.Pet_ID " + 
        "WHERE Pets.ID="+ "'"+ pet + " ORDER BY Date ASC" + " ';" 
        let data = sql.dbQuery(query, loginData)
        // console.log('test: '+ data)
        data.then( (value) => {
            // value['Pet_Name'] = petData['Pet_Name']
            // console.log('yo ' + JSON.stringify(value))
            return res.json(JSON.stringify(value))
            
        }
        )
    }
    else {
        return res.json(JSON.stringify({invalid: true}))
    }
    
    
    
}

)

app.get('/petNames', async function(req, res) {
    
    let valid = await loginCheck(req)

    if (valid == 1) {
        let user = get_cookies(req)['user']
    if (user == undefined) {
        let msg = {
            user: undefined
        }
        return res.json(JSON.stringify(msg))
    }
    // console.log(user)
    let query = "SELECT Pet, ID from Cat.Pets WHERE Owner = '" + user + "';"
    let data = sql.dbQuery(query, loginData)
    // console.log('test: '+ data)
    data.then( (value) => {
        // console.log('yo ' + JSON.stringify(value))
       
        
        return res.json(JSON.stringify(value))
           
    }
    )
    
    }
    else {
        return res.json(JSON.stringify({invalid: true}))
    }
    
    
});

app.get('/', function(req,res) {
    res.sendFile(path.join(publicDirectory + '/login.html'))

});

app.get('/stats', function(req,res) {
    res.sendFile(path.join(publicDirectory + '/stats.html'))

});

app.get('/weightForm', function(req,res) {
    res.sendFile(path.join(publicDirectory + '/weight.html'))

});


app.get('/feedingForm', function(req,res) {
    res.sendFile(path.join(publicDirectory + '/index.html'))

});


app.post('/petUpload', async function(req, res) {
    let pet = req.body.petSelect
    // console.log(pet)
    var cookieOptions =  {
        maxAge:1000*60*15, // expire in 15 minutes
        httpOnly:false
    }
    res.cookie('Pet_ID', pet, cookieOptions)
    
    res.redirect('/stats')

});





  app.listen(3000, function(err){ 
    if (err) console.log(err); 
    console.log("Server listening on PORT", 3000); 
});  


var get_cookies = function(request) {
    var cookies = {};
    try {
        request.headers && request.headers.cookie.split(';').forEach(function(cookie) {
            var parts = cookie.match(/(.*?)=(.*)$/)
            cookies[ parts[1].trim() ] = (parts[2] || '').trim();
          });
          return cookies;
    }
    catch (TypeError) {
        // console.log('No Pet Selected')
        return {}
    }
    
  };


  var loginCheck = async function(req) {
    let user= get_cookies(req)['user']
    let token = get_cookies(req)['token']
    if (user == undefined) {
        return 0
    }
    else {
        if (token == undefined) {
            return 0
        }
        else {
            let query = "SELECT sessionID FROM Sessions WHERE sessionToken =" + "'" + token + "'"
            let tokenCheck = await sql.dbQuery(query,loginData)
            let tokenResult;
            
            tokenResult = tokenCheck[0]

            if (tokenResult == undefined) {
                return 0
            }
            else {
                return 1
            }

        }
        
    }
};


