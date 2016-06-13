var btm = window.btm || {};
var network = window.btm.network || {};



/**
 * submit purchse to server
 *
 * @param {Number} amt - amount of bitcoin to purchase (in satoshis)
 * @param {onSubmittedPurchase} cb - called when purchase sent
 */
network.submitPurchase = function submitPurchase(amt, addr, cb) {
  $.ajax({
    type: 'POST',
    url: "/api/buy",
    contentType: "application/json",
    //contentType: 'application/json; charset=utf-8',
    dataType: 'json',
    data: JSON.stringify({'amt': amt, 'addr': addr}),
    complete: cb || {}
  });

}
