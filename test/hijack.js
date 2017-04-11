var util = require('../util');
var realRandom = util.getRandomInt;
var api = module.exports = {};

api.hijack = function() {
  util.getRandomInt = predictible();
};

api.reset = function() {
  util.getRandomInt = realRandom;
};

function predictible() {
  var base = 100000;
  var div = 11.03;

  return function(min, max) {
    var all = base / div;
    var floor = Math.floor(all);
    div += .01;
    if (div > base) {
      div -= base;
    }
    var rand = all - floor;
    return Math.floor(rand * (max - min + 1)) + min;
  };
}