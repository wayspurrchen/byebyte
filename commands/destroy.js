const fs = require( 'fs' );
const path = require('path');
const util = require('../util');
const Transform = require('stream').Transform;
const Promise = require('bluebird');

const bufferMax = 2147483647;
const chunkSize = 20000000;

// This stores the operations we plan to do to the buffer. We must
// store them ahead of time because we may get a very large file
// that requires a streaming approach.
const generateDestructions = (opts) => {
    const destructions = [];

    const getRandomInt = opts.getRandomInt || util.getRandomInt;
    const continuous = opts.continuous || false;
    const continuousChance = opts.continuousChance || 0.6;
    const times = opts.times || 50;

    var offset = getRandomInt(opts.start, opts.stop);
    for (var i = 0; i < times; i++) {
        destructions.push({
            offset,
            value: getRandomInt(1, 255)
        });

        // If we have continuous set to true, and trying to continue would
        // not run off the range of the buffer, we continue on to the next
        // pixel slot to override if we beat our continuousChance. If not,
        // we go to a random place within our range.
        if (continuous && (offset + 1 <= opts.len)) {
            if ((continuousChance > Math.random()) && (offset + 1 <= opts.stop)) {
                offset++;
            } else {
                offset = getRandomInt(opts.start, opts.stop);
            }
        } else {
            offset = getRandomInt(opts.start, opts.stop);
        }
    }

    destructions.sort((a, b) => {
        if (a.offset < b.offset) {
            return -1;
        } else if (a.offset > b.offset) {
            return 1;
        } else {
            return 0;
        }
    });

    return destructions;
};

const processBuffer = (fileBuffer, destructions) => {
    const len = fileBuffer.length;

    destructions.forEach(destruction => {
        fileBuffer[destruction.offset] = destruction.value;
    });

    return fileBuffer;
};

const processStreamFile = (filepath, outpath, destructions, length) => {
    const readStream = fs.createReadStream(filepath, {
        highWaterMark: chunkSize
    });

    let index = 0;

    const destroyStream = new Transform({
        transform: function (chunk, encoding, callback) {
            const chunkLen = chunk.length;

            for (let i = 0; i < destructions.length; i++) {
                const destruction = destructions[i];
                const target = destruction.offset;

                // If within bounds...
                if (target >= index && target < (index + chunkLen)) {
                    chunk[destruction.offset] = destruction.value;
                    destructions.splice(i, 1);
                    i--;
                } else {
                    // If OUT of bounds, then break because we know
                    // the destructions are ordered and the one we're
                    // looking out is out of the bounds of the current
                    // chunk
                    break;
                }
            }

            index += chunkLen;

            this.push(chunk);
            callback();
        }
    });

    return readStream.pipe(destroyStream);
};

var api = module.exports = {
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
        const startTimer = Date.now();

        // Unpack options from args
        const options = {
            times: argv.t || argv.times || 50,
            continuous: argv.c || argv.continuous,
            continuousChance: argv.C || argv.continuousChance || 0.6,
            input: path.resolve(process.cwd(), argv.i || argv.input),
            output: path.resolve(argv.o || argv.output),
            min: argv.min,
            max: argv.max,
            start: argv.start,
            stop: argv.stop
        };

        if (options.fileBuffer) {
            options.len = options.fileBuffer.length;
        } else if (options.input) {
            const stats = fs.statSync(options.input);
            options.len = stats['size'];
        }

        const result = api.fn(options);

        if (result instanceof Buffer) {
            fs.writeFileSync(path.resolve(process.cwd(), options.output), result);
        } else {
            let max = 3;
            let count = 0;
            const writeStream = fs.createWriteStream(options.output);

            let chunkCount = 0;
            const chunkPercentageOfFile = (chunkSize / options.len) * 100;

            result
                .on('data', chunk => {
                    chunkCount++;
                    if (chunkCount % 5 === 0) {
                        let percentDone = (chunkCount * chunkPercentageOfFile);
                        if (percentDone > 100) {
                            percentDone = 100;
                        }
                        console.log(percentDone.toFixed(2) + '% done');
                    }
                })
                .on('end', () => {
                    console.log('Complete.');
                    writeStream.end();
                    const stopTimer = Date.now();
                    console.log('Took ' + ((stopTimer - startTimer) / 1000) + 's.');
                });

            // Write stream out to disk
            result.pipe(writeStream);
        }
    },
    fn: (opts) => {
        util.checkArguments(opts);

        const needsStream = opts.len > bufferMax;

        const terms = opts.min !== undefined ? ['min', 'max'] : ['start', 'stop'];
        const startStop = util.determineModificationRange(opts, opts.len);
        const start = startStop.start;
        const stop = startStop.stop;
        if (start > stop) {
            throw new Error(`${terms[0]} must be smaller than ${terms[1]}`);
        }

        console.log('File length: ' + opts.len);

        const destructions = generateDestructions({
            start,
            stop,
            times: opts.times,
            getRandomInt: opts.getRandomInt,
            continuous: opts.continuous,
            continuousChance: opts.continuousChance
        });

        if ((opts.stop || 0) > opts.len) {
            throw new Error('stop must be <= the length of the file buffer');
        }

        const handleBuffer = (fileBuffer) => {
            console.log(
                'Randomly assigning hex values within bytes ' +
                start + ' and ' + stop
            );

            const result = processBuffer(fileBuffer, destructions);

            console.log(
                'Replaced ' + opts.times + ' byte(s) with trash and exported to ' +
                opts.output + '.'
            );

            return result;
        };

        if (opts.fileBuffer) {
            return handleBuffer(opts.fileBuffer);
        } else if (opts.input) {
            if (needsStream) {
                console.log('File is larger than 2 gigabytes. Using streaming processing...');
                return processStreamFile(opts.input, opts.output, destructions, opts.len);
            } else {
                return handleBuffer(fs.readFileSync(opts.input));
            }
        } else {
            throw new Error('Must specify either a fileBuffer or filepath to destroy arguments');
        }
    }
};
