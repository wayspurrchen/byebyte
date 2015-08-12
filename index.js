#! /usr/bin/env node
var fs = require( 'fs' );
var path = require( 'path' );
var argv = require( 'minimist' )( process.argv.slice( 2 ) );
var log = require( 'npmlog' );

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

var continuous = argv.c || argv.continuous;
if ( continuous === 'false' ) continuous = false;
if ( continuous === undefined ) continuous = true;
var continuousChance = argv.C || argv.continuousChance || 0.6;
console.log( 'Continuous mode:', continuous );
console.log( 'Continuous chance:', continuousChance );

var times = argv.t || argv.times || 50;
var out = argv.o || argv.out;
var file = argv.f || argv.file;
var buf = fs.readFileSync( path.resolve( process.cwd(), file ) );
var len = buf.length;
var min = Math.floor( len * (argv.min || 0.1) );
var max = Math.floor( len * (argv.max || 0.9) );
console.log( "File length: " + len );
console.log( "Randomly assigning hex values within bytes " + min + " and " + max );

var offset = getRandomInt( min, max );
for ( var i = 0; i < times; i++ ) {
	var val = getRandomInt( 0, 255 );
	buf[ offset ] = getRandomInt( 0, 511 );
	// console.log( offset, val );

	// If we have continuous set to true, we continue on to the next
	// pixel slot to override if we beat our continuousChance. If not,
	// we go to a random place within our range.
	if ( continuous ) {
		if ( continuousChance > Math.random() && ( offset + 1 <= max ) ) {
			// console.log( 'Continuous!' );
			offset = offset++;
		} else {
			// console.log( 'Continuity broken' );
			offset = getRandomInt( min, max );
		}
	} else {
		offset = getRandomInt( min, max );
	}
}
fs.writeFileSync( path.resolve( process.cwd(), out ), buf );
console.log( 'Replaced ' + times + ' byte(s) with trash and exported to ' + out + '.' );