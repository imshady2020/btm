/**
 * post request handlers n etcetera
 */

var debug = require('debug')('btm:generic');


/**
 * set up object for middleware communication
 */
var setup = function setup(req, res, next) {
  req.btm = {};
  if (typeof req.body === 'undefined') return res.status(400).send({"err": true, "msg": "you got no body!"})
  if (req.body.amt) {
    // sanity check
    // @todo in the future, this should be validated based on how much money
    //       was collected from the bill accceptor
    //       also ^ should be put in it's own module
    if (typeof req.body.amt !== 'number') return res.status(400).send({"err": true, "msg": "amt must be a number!"});
    req.btm.amt = req.body.amt;
  }
  if (req.body.addr) {
    if (typeof req.body.addr !== 'string') return res.status(400).send({"err": true, "msg": "addr must be a string"});
    req.btm.addr = req.body.addr;
  }

  debug(req.body);
  return next();
};


/**
 * respond with data in middleware object
 */
var respond = function respond(req, res) {
  if (typeof req.btm === 'undefined') throw new Error('check yo code. generic.respond() must be called after generic.setup()');
  if (req.btm.err) return res.status(500).send({"err": true, "msg": req.btm.err.msg});

  return res.status(200).send({"err": false, "dat": req.btm.dat});
};


module.exports = {
  setup: setup,
  respond: respond
}
