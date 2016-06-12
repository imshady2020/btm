# btm
simple bitcoin atm



# Development notes

Make sure to use RELEASES of Bitcore-lib, not just the latest npm package. So to do this, go to https://github.com/bitpay/bitcore-lib/releases and find the latest release version. At time of writing, it was v0.13.14. Using this version, find the appropriate npm version using `npm show bitcore-lib`, then add that version as a dependency to the btm project.
