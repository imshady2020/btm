var program = require('commander');

program
    .version('0.0.1')
    .command('buy <satAmt>')
    .command('sell <satAmt>')
    .option('-d, --dry-run', 'Dry run, dont actually do anything')
    .parse(process.argv);

console.log('');
if (program.d) console.log('Dry run');
