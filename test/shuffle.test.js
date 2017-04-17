var fs = require('fs');
var path = require('path');

var test = require('tape');

var predictible = require('./predictible');
var byebyte = require('../index');

test('[shuffle] basic opts', function(assert) {
    var getRandomInt = predictible();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
    var expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'shuffle-basic-opts.jpg'));

    var out = byebyte.shuffle(fileBuffer, {min:.3, max:.5, getRandomInt});

    assert.ok(expected.equals(out), 'the output matches the expected buffer')

    assert.end();
});
