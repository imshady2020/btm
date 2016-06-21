var nedb = require('nedb');
var path = require('path');
var bitcorelib = require('bitcore-lib');
var Address = bitcorelib.Address;
var Networks = bitcorelib.Networks;


var db = new nedb({
    filename: path.join(__dirname, '..', 'btm.nedb'),
    autoload: true
});



var doc = { 
    date: new Date(),
    fruits: [ 'apple', 'orange', 'pear' ],
    infos: { name: 'nedb' }
};



var createTransaction = function recordTransaction(cb) {
    db.insert(doc, cb);
};


var readTransaction = function readTransaction(identifier, cb) {
    if (typeof identifier !== 'string') throw new Error('identifier must be a string');
    if (Address.isValid(identifier, process.env.LIVENET ? Networks.livenet : Networks.testnet)) {
	db.find({ "address": identifier }, cb);
    }
    else {
	db.find({ "id": identifier }, cb);
    }
};


module.exports = {
    createTransaction: createTransaction,
    readTransaction: readTransaction
}
