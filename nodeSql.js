// const { json } = require('body-parser');



// exports.dbQuery = function dbQuery(sql, creds) {
//     mysql = require('mysql');

//     function handleDisconnect() {
//         var dbConfig = creds
//         var connection = mysql.createConnection(dbConfig); // Recreate the connection, since
//                                                         // the old one cannot be reused.
        
//         connection.connect(function(err) {              // The server is either down
//             if(err) {                                     // or restarting (takes a while sometimes).
//             console.log('error when connecting to db:', err);
//             setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
//             }                                     // to avoid a hot loop, and to allow our node script to
//         });                                     // process asynchronous requests in the meantime.
//                                                 // If you're also serving http, display a 503 error.
//         connection.on('error', function(err) {
//             if(err.code === 'PROTOCOL_CONNECTION_LOST') { // Connection to the MySQL server is usually
//             console.log('Timeout Expired. Connection Closed to DB')
//             } else {                                      // connnection idle timeout (the wait_timeout
//             throw err;                                  // server variable configures this)
//             }
//         });
        
//         connection.query(sql, function (err, result, fields) {
//             if (err) throw err;
//             console.log("Result: " + JSON.stringify(result));
//             return result
//         });
        
        
//     }
//     handleDisconnect();

    
//     }
exports.dbQuery = function dbQuery(databaseQuery, creds) {
    mysql = require('mysql');
    var dbConfig = creds
    var db = mysql.createConnection(dbConfig); // Recreate the connection, since
                                                        // the old one cannot be reused
    return new Promise(data => {
        db.query(databaseQuery, function (error, result) { // change db->connection for your code
            if (error) {
                console.log(error);
                throw error;
            }
            try {
                console.log(result);

                data(result);

            } catch (error) {
                data({});
                throw error;
            }

        });
    });

}
    

    
    

    




