var btm = window.btm || {};
var network = window.btm.network || {};


var editTimer = null;
var tickerTimer = null;

var bitcore = require('bitcore-lib');
var isLivenet = false;
var Address = bitcore.Address;
var Networks = bitcore.Networks;

var inventory = {}
inventory.bitcoin = 0.0200;
inventory.usd = 20;

var ticker = 380;

// Create number formatter.
var usdFormatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
});



updateTicker();

$('#camera-snapshot').on('click', function(event) {
  console.log('click!')
  $('#cameraModal').modal('show');
  load();
});

$('#stopper').on('click', function(event) {
  console.log('stopper!');
  unload();
});

$('#modalClose').on('click', function(event) {
  $('#cameraModal').modal('hide');
  unload();
});

$('#modalX').on('click', function(event) {
  $('#cameraModal').modal('hide');
  unload();
});


$('#bitcoin-address-payout').on('input',function(e){
  // verify that user has entered a valid bitcoin address
  // once the user has stopped entering input
  clearInterval(editTimer);
  editTimer = setTimeout(function(e) {
    validateInput();
  }, 500);
});


$('button#bitcoin-payout').on('click', function(e) {
  // validate address once again
  clearInterval(editTimer); // stop the verify timer because the user was quick
  validateInput();
});


function isValidBitcoinAddress(address) {
  if (!Address.isValid(address, isLivenet ? 'livenet' : 'testnet'))
    return false;
  else
    return true;
}

function parseInput(data) {
  // detect type. bip21 URI or just plain address
  var isBIP21 = bitcore.URI.isValid(data);
  var isAddress = bitcore.Address.isValid(data);
  var address = '';

  if (isBIP21) {
    // get the address
    var uri = new bitcore.URI(data);
    address = uri.address.toString();
  }
  // validate the address
  else if (isAddress) {
    address = data;
  }

  return address;
}

var validateInput = function validateInput() {
  var addr = $('#bitcoin-address-payout').val();
  var isValid = isValidBitcoinAddress(addr);
  console.log('%s %s valid', addr, isValid ? 'is' : 'is not');

  if (!isValid) {
    // display red X
    $('#bitcoin-address-validity').removeClass('glyphicon-arrow-right');
    $('#bitcoin-address-validity').removeClass('glyphicon-ok');
    $('#bitcoin-address-validity').addClass('glyphicon-remove');
    $('#bitcoin-address-validity').css('color', 'red');
    $("button#purchase-bitcoin-payout").addClass("disabled");
  }
  else {
    // display green checkmark
    $('#bitcoin-address-validity').removeClass('glyphicon-arrow-right');
    $('#bitcoin-address-validity').removeClass('glyphicon-remove');
    $('#bitcoin-address-validity').addClass('glyphicon-ok');
    $('#bitcoin-address-validity').css('color', 'green');
    $("button#purchase-bitcoin-payout").removeClass("disabled");
  }
};



btm.enterScanData = function enterScanData(scanData) {
  $('#bitcoin-address-payout').val(parseInput(scanData));
  validateInput();
}


/**
 * update the bitcoin exchange rate
 */
function updateTicker() {
  $.get('https://api.bitcoinaverage.com/all', function(data) {
    ticker = data.USD.global_averages['24h_avg'] || ticker;

    setTimeout(updateTicker, 3600000);
  });
};


function calculateBitcoinCost(btc) {
  return btc * ticker;
}

function calculateUSDCost(usd) {
  return usd / ticker;
}

// sliders
var pSliderBitcoin = $("#purchase-slider-bitcoin").slider({
  step: 0.0001,
  min: 0,
  max: inventory.bitcoin,
  value: 0
});

// when bitcoin slider is slid,
//   update text
//   update other slider
$("#purchase-slider-bitcoin").on("slide slideStop", function(e) {
	$("#purchase-slider-bitcoin-display").text(e.value);
  (function updatePurchaseCost(btc) {
    $("#purchase-cost-display").text(usdFormatter.format(calculateBitcoinCost(btc)));
  })(e.value)
});


$("button#purchase-bitcoin-payout").on("click", function(e) {
  var amount = $("#purchase-slider-bitcoin").slider('getValue');
  var address = $("#bitcoin-address-payout").val();
  network.submitPurchase(Math.floor(amount * 100000000), address); // convert to sats & send

  $("input#bitcoin-address-payout").val('');
  $("button#purchase-bitcoin-payout").addClass("disabled");
  $('#purchaseModal').modal('show');
});

$("#tester").on("click", function() {
   // convert to sats & send
  network.submitPurchase(28300, 'mu3F27qcViM4udXFFiGrjEa7nmNmzS8ocf', function(e) {
    console.log(e);
  });
});

  //
  // <!-- A button for taking snaps -->
  // <form>
  //   <input type=button value="Take Snapshot" onClick="take_snapshot()">
  // </form>
