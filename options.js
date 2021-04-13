var fs = require('fs'),
configPath = './Config/config.json';
var parsed = JSON.parse(fs.readFileSync(configPath, 'UTF-8'));
parsed.cert = fs.readFileSync("./Config/rds-ca-2019-root.pem")
exports.storageConfig=  parsed;