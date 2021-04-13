
exports.dbQuery = function dbQuery(databaseQuery, creds) {
    mysql = require('mysql');
    var dbConfig = creds
    var db = mysql.createConnection(dbConfig); // Recreate the connection, since
    // the old one cannot be reused
    return new Promise(data => {
        db.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                data({});
            }
            try {
                // console.log(result);

                data(result);
                

            } catch (error) {
                data({});
                
            }

        });
        db.end()
    });
}
    

    
    

    




