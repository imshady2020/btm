var request = require('request');
//var debug = require('debug')('btm:price');




var getLast = function getLast(cb) {
  request.get({
    "uri": "https://api.bitcoinaverage.com/ticker/global/USD/"
  }, function(err, res, body) {
    if (err) return cb(err);
    if (res.statusCode != 200)
      return cb(
        new Error("bitcoin average did not return code 200. Got instead " + res.statusCode),
        null
      );


    var b;
    try {
      b = JSON.parse(body);
    }
    catch(e) {
      return cb(e, null);
    }

    if (typeof b.last !== 'number')
      return cb(
        new Error("could not get last price from bitcoin average ticker"),
        null
      );
    return cb(null, b.last);
  });
}


module.exports = {
  getLast: getLast
}
