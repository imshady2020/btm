var path = require('path');
var assert = require('chai').assert;

var db = require(path.join(__dirname, '..', 'lib', 'database'));


describe('Transaction', function() {
    describe('recordTransaction()', function() {
	it('should create a new transaction in nedb', function(done) {
	    db.createTransaction(function(err, doc) {
		assert.isNull(err);
		assert.isObject(doc);
		console.log(doc);

		db.readTransaction(doc._id, function(err, doc) {
		    assert.isNull(err);
		    assert.isObject(doc);
		    done();
		});
	    });
	});
    });
});
