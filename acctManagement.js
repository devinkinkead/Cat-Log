exports.createAccount = async function accountCreator(user,pass, sql, creds) {
    let query = "SELECT COUNT(user) AS COUNT FROM Accounts WHERE user=" + "'" + user + "'"
    existingActCheck = sql.dbQuery(query,creds)
    // console.log(result)


    // Handle event of DB disconnecting/failure

    try {
        let test = await existingActCheck
        let test2 = test[0]['Count']
    }
    catch (TypeError) {
        return 2
    } 
        
    let result = JSON.parse(JSON.stringify(await existingActCheck))

    if (result[0]['COUNT'] == 1) {
        // Account Already Exists
        return 1
    }
    else {

        // let hashedPw = hash(pass)

        const bcrypt = require('bcrypt');
        const saltRounds = 12;
        
        const hashedPassword = await bcrypt.hash(pass, saltRounds)
    
        
        // Now we can store the password hash in db.
        
        let query = "INSERT INTO Accounts(user,password) VALUES(" + "'" + user + "'" + "," +  "'"+ hashedPassword +"'" + ")"
        sqlRes = sql.dbQuery(query,creds)
        
        // Hanlde Event of DB disconnecting/failure
        try {
            let test = await sqlRes
            let test2 = test['affectedRows']
        }
        catch (TypeError) {
            return 2
        }

        if (await sqlRes == {}) {
            return 2
        }
        else {
            let result = JSON.parse(JSON.stringify(await sqlRes))

            if (result['affectedRows'] == 1) {
                // Successful Creation
                return 0
            }
            else {
                // Failed
                return 2
            }
        }
               
        
            
    
    }
    
    



        


}

exports.authenticate = async function compare(user, password, sql, creds) 
{
  let query = "Select user, password FROM Accounts WHERE user='"+ user + "'"
  data = sql.dbQuery( query , creds)
  
  let valueResult = JSON.parse(JSON.stringify(await data))
    let encrypted = ""
    try {
      
      encrypted = valueResult[0]['password']
    }
    catch (TypeError) {
      console.log('User not Found.')
      return 2
    
    }
    const bcrypt = require('bcrypt');
    
    let authenticator = await bcrypt.compare(password, encrypted)
    // console.log(authenticator)
    if (authenticator) {
        return 0
    }
    else
    {
        return 1
    }
    


        
    

}      
       
