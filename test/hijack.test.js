var test = require('tape');
var util = require('../util');
var hijack = require('./hijack');

var projected = [18, 98, 78, 59, 42];

test('[hijack] random is predictable', function(assert) {
    hijack.hijack();

    var a = [];
    for (var i=0; i<5; i++) {
        a.push(util.getRandomInt(0, 100));
    }

    projected.forEach(function(v, i) {
        assert.equal(a[i], v, 'random number '+(i+1)+' is predictable');
    });

    hijack.reset();

    assert.end();
});

test('[hijack] random is repeatable', function(assert) {
    hijack.hijack();

    var a = [];
    for (var i=0; i<10; i++) {
        a.push(util.getRandomInt(0, 100));
    }

    hijack.reset();

    hijack.hijack();

    for (var i=0; i<10; i++) {
      var b = util.getRandomInt(0, 100);
      assert.equal(a[i], b, 'random number '+(i+1)+' is repeatable');
    }

    hijack.reset();

    assert.end();
});

test('[hijack] random is resetable', function(assert) {
    hijack.hijack()

    var a = [];
    for (var i=0; i<10; i++) {
        a.push(util.getRandomInt(0, 100));
    }

    hijack.reset();

    for (var i=0; i<10; i++) {
      var b = util.getRandomInt(0, 100);
      assert.notEqual(a[i], b, 'number '+(i+1)+' is now not hijacked');
    }

    assert.end();

});
