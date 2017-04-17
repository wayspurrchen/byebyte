var throwCheck = module.exports = function(assert, cb, msg, about) {
  try {
    cb();
  }
  catch (err) {
    return assert.equals(msg, err.message, about);
  }
  assert.fail('did not throw: '+about);
};

