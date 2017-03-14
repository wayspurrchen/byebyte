#! /usr/bin/env node

var path = require( 'path' );
var log = require( 'npmlog' );
var yargs = require('yargs');
var destroy = require('./commands/destroy');
var shuffle = require('./commands/shuffle');

var globalOptions = {
    min: {
        describe: 'the lower bound of the file to alter bytes in - use percentage 0 to 1 (ex: 0.15 = 15%, 1 = 100%). If specified, you cannot use --start or --stop',
        global: true,
        type: 'number'
    },
    max: {
        describe: 'the upper bound of the file to alter bytes in - use percentage from 0 to 1 (ex: 0.15 = 15%, 1 = 100%). If specified, you cannot use --start or --stop',
        global: true,
        type: 'number'
    },
    start: {
        describe: 'a specific point at the file, in bytes, at which to begin altering bytes. If specified, you cannot use --min or --max',
        global: true,
        type: 'string'
    },
    stop: {
        describe: 'a specific point at the file, in bytes, at which to stop altering bytes. If specified, you cannot use --min or --max',
        global: true,
        type: 'string'
    },
    input: {
        alias: 'i',
        describe: 'path to the file to modify',
        global: true,
        demand: true,
        type: 'string'
    },
    output: {
        alias: 'o',
        describe: 'path to where to write the modified file',
        global: true,
        demand: true,
        type: 'string'
    }
};

var argv = yargs
    .command(destroy)
    .command(shuffle)
    .demand(1)
    .options(globalOptions)
    .strict()
    .help()
    .argv
