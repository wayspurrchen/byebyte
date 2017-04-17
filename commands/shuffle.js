var fs = require( 'fs' );
var path = require('path');
var util = require('../util');
var shuffle = require('shuffle-array')

/**
 * Shuffle - works by taking the file and splitting it into various chunks.
 *
 * Chunks can have a specific length randomly determined by range
 * The chunks are then sorted according to 
 */

var api = module.exports = {
    command: 'shuffle',
    desc: 'reorder the data in the file',
    builder: function (yargs) {
        var options = {
            'chunk-min': {
                describe: 'the minimum size a shuffled chunk may be',
                type: 'number'
            },
            'chunk-max': {
                describe: 'the maximum size a shuffled chunk may be',
                type: 'number'
            }
        };

        return yargs.options(options)
            .usage([
                'Shuffle builds a new file with the contents of the file shuffled into random chunks with ',
                'each chunk being a random size between the specified --chunk-min and --chunk-max.'
            ].join(''))
            .example('$0 shuffle --chunk-min 40 --chunk-max 1000 --min 0.3 --max 0.8 --input file.jpg --output file_byebyte.jpg');
    },
    handler: function (argv) {
        var filepath = argv.i || argv.input;
        var out = argv.o || argv.output;
        var fileBuffer = fs.readFileSync( path.resolve( process.cwd(), filepath ) );
        var len = fileBuffer.length;
       var startStop = util.determineModificationRange(argv, len);
        var start = startStop.start;
        var stop = startStop.stop;
        console.log( "File length: " + len );
        console.log( "Randomly shuffling chunks between " + start + " and " + stop);

        var buf = api.fn(fileBuffer, {
          start: start,
          stop: stop,
          chunkMin: argv['chunk-min'],
          chunkMax: argv['chunk-max'],
        });

        fs.writeFileSync( path.resolve( process.cwd(), out ), buf );
        console.log('Reshuffled bytes and wrote to ' + out + '.');
    },
    fn: function(fileBuffer, opts) {
        var getRandomInt = opts.getRandomInt || util.getRandomInt;
        var len = fileBuffer.length;

        var startStop = util.determineModificationRange(opts, len);
        var start = startStop.start;
        var stop = startStop.stop;

        var chunkBuf = fileBuffer.slice(start, stop);
        var chunkBufLen = chunkBuf.length;
        var chunks = [];

        var index = 0;
        while (index < chunkBufLen) {
            var bufLeft = chunkBufLen - index;
            var chunkSize = getRandomInt(opts.chunkMin, opts.chunkMax);
            if (chunkSize > bufLeft) {
                chunkSize = bufLeft;
            }

            var chunk = chunkBuf.slice(index, index + chunkSize);
            chunks.push(chunk);

            index += chunkSize;
        }

        var buf = Buffer.alloc(len);
        var bufIndex = 0;
        if (start > 0) {
            fileBuffer.copy(buf, bufIndex, 0, start);
            bufIndex = start;
        }

        shuffle(chunks);

        chunks.forEach(function (chunk) {
            var time = Date.now();
            chunk.copy(buf, bufIndex, 0, chunk.length);
            bufIndex += chunk.length;
            var doneTime = Date.now();
        });

        if (stop < len) {
            fileBuffer.copy(buf, bufIndex, stop, len);
        }

        return buf;
    }
};
