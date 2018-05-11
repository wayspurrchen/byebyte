var fs = require('fs');
var path = require('path');

var test = require('tape');

var predictable = require('./predictable');
var throwCheck = require('./throw-check');

var byebyte = require('../index');

test('[destroy] basic opts', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
    var expected = fs.readFileSync(path.join(__dirname, 'fixtures', 'destroy-basic-opts.jpg'));

    var out = byebyte.destroy({
        fileBuffer,
        getRandomInt,
        min: 0.3,
        max: 0.5,
        chunkMin: 5,
        chunkMax: 50
    });

    assert.ok(expected.equals(out), 'the output matches the expected buffer');

    assert.end();
});

test('[destroy] has stop but missing start', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, stop:.5, getRandomInt });
    }, 'start must be provided', 'throws the right error message');

    assert.end();
});

test('[destroy] has start but missing stop', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, start:.5, getRandomInt });
    }, 'stop must be provided', 'throws the right error message');

    assert.end();
});

test('[destroy] has max but missing min', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, max:.5, getRandomInt });
    }, 'min must be provided', 'throws the right error message');

    assert.end();
});

test('[destroy] has min but missing max', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, min:.5, getRandomInt });
    }, 'max must be provided', 'throws the right error message');

    assert.end();
});

test('[destroy] min/max and start/stop are used', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, min:.5, max: .6, start: 400, stop: 9000, getRandomInt });
    }, 'min/max and start/stop cannot be used together', 'throws the right error message');

    assert.end();
});

test('[destroy] max is greater than 1', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, min:.1, max: 1.01, getRandomInt });
    }, 'max must be <= 1', 'throws the right error message');

    assert.end();
});

test('[destroy] min is smaller than zero', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, min:-.1, max: .3, getRandomInt });
    }, 'min must be >= 0', 'throws the right error message');

    assert.end();
});

test('[destroy] min is bigger than max', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, min:.5, max: .3, getRandomInt });
    }, 'min must be smaller than max', 'throws the right error message');

    assert.end();
});

test('[destroy] start is smaller than zero', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, start:-1, stop: 5, getRandomInt });
    }, 'start must be >= 0', 'throws the right error message');

    assert.end();
});

test('[destroy] start is bigger than stop', function(assert) {
    var getRandomInt = predictable();
    var fileBuffer = fs.readFileSync(path.join(__dirname, './logo.jpg'));
  
    throwCheck(assert, function() {
        byebyte.destroy({ fileBuffer, start:5, stop: 3, getRandomInt });
    }, 'start must be smaller than stop', 'throws the right error message');

    assert.end();
});

