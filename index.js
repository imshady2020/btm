var path = require('path');
var program = require('commander');
var price = require(path.join(__dirname, 'lib', 'price'));


program
  .version('0.0.1')
  .option('-d, --dry-run', 'Dry run, dont actually do anything')

program
  .command('buy <satAmt>')
  .alias('b')
  .description('buy Bitcoin with USD')

program
  .command('sell <satAmt>')
  .alias('s')
  .description('sell Bitcoin for USD')

program
  .command('price')
  .alias('p')
  .description('get the current USD price of 1 Bitcoin')
  .action(function(env) {
    console.log('getting price...');
    price.getLast(function(err, lastPrice) {
      if (err) console.log(err);
      console.log(lastPrice);
    });
  })


program.parse(process.argv);

if (program.d) console.log('Dry run');
