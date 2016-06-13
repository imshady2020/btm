
var path = require('path');
var express = require('express');
var bodyParser = require('body-parser');
var wallet = require('./wallet');
var generic = require('./generic');

var server = express();


server.use(bodyParser.json()); // for parsing application/json
server.post('/api/buy', generic.setup, wallet.buy, generic.respond);
server.use(express.static(path.join(__dirname, '..', 'ui')));


server.listen(process.env.PORT);


module.exports = server;
