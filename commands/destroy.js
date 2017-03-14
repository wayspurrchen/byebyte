var fs = require( 'fs' );
var path = require('path');
var util = require('../util');

module.exports = {
    command: 'destroy',
    desc: 'overwrite file with random data',
    builder: function (yargs) {
        var options = {
            times: {
                alias: 't',
                describe: 'the number of times to corrupt a byte',
                type: 'number'
            },
            continuous: {
                alias: 'c',
                describe: 'whether or not to randomly continue corrupting the next piece of data',
                'default': false,
                type: 'boolean'
            },
            'continuous-chance': {
                alias: 'C',
                describe: 'the percent chance from 0 - 1 (0.1 = 10%, 1 = 100%) to continue corrupting the immediate next byte after the last byte instead of corrupting a random next byte',
                'default': 0.6,
                type: 'number'
            }
        };

        return yargs.options(options)
            .example('$0 destroy --min 0.3 --max 0.8 --input file.jpg --output file_byebyte.jpg');
    },
    handler: function (argv) {
        var continuous = argv.c || argv.continuous;
        var continuousChance = argv.C || argv.continuousChance || 0.6;

        var times = argv.t || argv.times || 50;
        var filepath = argv.i || argv.input;
        var out = argv.o || argv.output;
        var buf = fs.readFileSync( path.resolve( process.cwd(), filepath ) );
        var len = buf.length;
        var startStop = util.determineModificationRange(argv, len);
        var start = startStop.start;
        var stop = startStop.stop;
        console.log( "File length: " + len );
        console.log( "Randomly assigning hex values within bytes " + start + " and " + stop);

        var offset = util.getRandomInt(start, stop);
        for (var i = 0; i < times; i++) {
            buf[ offset ] = util.getRandomInt(1, 255);

            // If we have continuous set to true, and trying to continue would
            // not run off the range of the buffer, we continue on to the next
            // pixel slot to override if we beat our continuousChance. If not,
            // we go to a random place within our range.
            if (continuous && (offset + 1 <= len)) {
                if ((continuousChance > Math.random()) && (offset + 1 <= stop)) {
                    offset++;
                } else {
                    offset = util.getRandomInt(start, stop);
                }
            } else {
                offset = util.getRandomInt(start, stop);
            }
        }
        fs.writeFileSync( path.resolve( process.cwd(), out ), buf );
        console.log( 'Replaced ' + times + ' byte(s) with trash and exported to ' + out + '.' );
    }
};
