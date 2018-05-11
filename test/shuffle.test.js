var fs = require('fs');
var path = require('path');

var test = require('tape');

var predictable = require('./predictable');
var throwCheck = require('./throw-check');

var byebyte = require('../index');

test('[shuffle] basic opts', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
    var expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'shuffle-basic-opts.jpg'));

    var out = byebyte.shuffle(fileBuffer, {min:.3, max:.5, getRandomInt, chunkMin: 5, chunkMax: 50});

    assert.ok(expected.equals(out), 'the output matches the expected buffer')

    assert.end();
});

test('[shuffle] has stop but missing start', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {stop:.5, getRandomInt});
    }, 'start must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] has start but missing stop', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:.5, getRandomInt});
    }, 'stop must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] has max but missing min', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {max:.5, getRandomInt});
    }, 'min must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] has min but missing max', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {min:.5, getRandomInt});
    }, 'max must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] min/max and start/stop are used', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {min:.5, max: .6, start: 400, stop: 9000, getRandomInt});
    }, 'min/max and start/stop cannot be used together', 'throws the right error message');

    assert.end();
});

test('[shuffle] max is greater than 1', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {min:.1, max: 1.01, getRandomInt});
    }, 'max must be <= 1', 'throws the right error message');

    assert.end();
});

test('[shuffle] min is smaller than zero', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {min:-.1, max: .3, getRandomInt});
    }, 'min must be >= 0', 'throws the right error message');

    assert.end();
});

test('[shuffle] min is bigger than max', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {min:.5, max: .3, getRandomInt});
    }, 'min must be smaller than max', 'throws the right error message');

    assert.end();
});

test('[shuffle] stop is greater than the buffer size', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:10, stop: fileBuffer.length+10, getRandomInt});
    }, 'stop must be <= the length of the file buffer', 'throws the right error message');

    assert.end();
});

test('[shuffle] start is smaller than zero', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:-1, stop: 5, getRandomInt});
    }, 'start must be >= 0', 'throws the right error message');

    assert.end();
});

test('[shuffle] start is bigger than stop', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:5, stop: 3, getRandomInt});
    }, 'start must be smaller than stop', 'throws the right error message');

    assert.end();
});

test('[shuffle] chunkMin is not provided', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:10, stop: 20, getRandomInt});
    }, 'chunkMin must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] chunkMin is -1', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:10, stop: 20, chunkMin: -1, getRandomInt});
    }, 'chunkMin must be > 0', 'throws the right error message');

    assert.end();
});

test('[shuffle] chunkMax is not provided', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:10, stop: 20, chunkMin: 1, getRandomInt});
    }, 'chunkMax must be provided', 'throws the right error message');

    assert.end();
});

test('[shuffle] chunkMin is > chunkMax', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.shuffle(fileBuffer, {start:10, stop: 20, chunkMin: 10, chunkMax: 1, getRandomInt});
    }, 'chunkMin must be <= chunkMax', 'throws the right error message');

    assert.end();
});

