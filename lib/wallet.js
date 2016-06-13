

var path = require('path');
// var nedb = require('nedb');
var bitcore = require('bitcore-lib');
var debug = require('debug')('btm:wallet');
var db = require(path.join(__dirname, '..', 'db.json'))

// var db = new nedb({
//   filename: path.join(__dirname, '..', 'data.nedb')
// });

var priv = 'L1uyy5qTuGrVXrmrsvHWHgVzW9kKdrp27wBC7Vs6nZDTF2BRUVwy'; // @todo move to config (and make a fresh one)
var isLivenet = false; // @todo move to config




//
// var createTransaction = function createTransaction(amt, to) {
//
//   var utxo = {
//     "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
//     "outputIndex" : 0,
//     "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
//     "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
//     "satoshis" : amt
//   };
//
//   var transaction = new bitcore.Transaction()
//     .from(utxo)
//     .to('1Gokm82v6DmtwKEB8AiVhm82hyFSsEvBDK', 15000)
//     .change()
//     .sign(privateKey);
// }









/**
 * the user just
 */
var buy = function buy(req, res, next) {

  if (typeof req.btm === 'undefined') throw new Error('check yo code! req.btm needs to be set by generic.setup first!');
  if (typeof req.btm.amt === 'undefined') {
    req.btm.err = {'msg': 'check yo code! req.btm.amt must be defined!'};
    return next();
  }
  if (typeof req.btm.addr === 'undefined') {
    req.btm.err = {'msg': 'check yo code! req.btm.addr must be defined!'};
    return next();
  }
  var amt = req.btm.amt;
  var addr = req.btm.addr;

  // validate address
  if (!bitcore.Address.isValid(addr, isLivenet ? 'livenet' : 'testnet')) {
    req.btm.err = {'msg': 'invalid bitcoin address received. livenet='+isLivenet};
    return next();
  }


  var privateKey = new bitcore.PrivateKey(priv);
  var utxo = {
    "txId" : "115e8f72f39fad874cfab0deed11a80f24f967a84079fb56ddf53ea02e308986",
    "outputIndex" : 0,
    "address" : "17XBj6iFEsf8kzDMGQk5ghZipxX49VXuaV",
    "script" : "76a91447862fe165e6121af80d5dde1ecb478ed170565b88ac",
    "satoshis" : amt
  };

  // create new address to use as change address
  var changeAddress = privateKey.toAddress(isLivenet ? bitcore.Networks.livenet : bitcore.Networks.testnet);
  debug('vvv new address vvv');
  debug(changeAddress);

  // @todo calculate best fee
  var fee = 675;

  var transaction = new bitcore.Transaction()
    .from(utxo)
    .to(addr, amt)
    .fee(fee)
    .change(changeAddress)
    .sign(privateKey);

  debug(transaction.toString());
  debug(transaction.serialize());

  req.btm.dat = transaction.toString();
  return next();
}







module.exports = {
  buy: buy
}
