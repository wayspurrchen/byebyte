# byebyte as a node module

## Usage

The example below first shuffles some bytes in the input file before randomly destorying other bytes.

```js
var byebyte = require('byebyte');
var fs = require('fs');

var input = fs.readFileSync('./some-input-file');

var out = byebyte.shuffle(input, {min:.3, max: .5, chunkMin: 10, chunkMax: 20});
out = byebyte.destroy(out, {min:.51, max:.8});

fs.writeFileSync('./some-output-file');
```

## API

### byebyte.destroy([buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html#buffer_buf_equals_otherbuffer), opts)

`byebyte.destroy` takes a buffer and an options object and returns a buffer.

The options object can have any of the long form flags from the cli command along with:

- getRandomInt: this is a function that takes two ints and returns a random integer in the range.

### byebyte.shuffle([buffer](https://nodejs.org/dist/latest-v6.x/docs/api/buffer.html#buffer_buf_equals_otherbuffer), opts)

`byebyte.shuffle` takes a buffer and an options object and returns a buffer.

The options object can have any of the long form flags from the cli command along with:

- getRandomInt: this is a function that takes two ints and returns a random integer in the range.
