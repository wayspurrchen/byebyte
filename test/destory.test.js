var fs = require('fs');
var path = require('path');

var test = require('tape');
var pixelmatch = require('pixelmatch');

var hijack = require('./hijack');
var byebyte = require('../index');

var width = 400;
var height = 198;

test('[destroy] basic opts', function(assert) {
    hijack.hijack();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
    var expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'destroy-basic-opts.jpg'));

    var out = byebyte.destroy(fileBuffer, {min:.3, max:.5});

    var diff = pixelmatch(expected, out, null, width, height, {threshold: 0.1});

    assert.equal(0, diff, 'there is no difference between a previous and now');

    hijack.reset();
    assert.end();
});
