function determineModificationRange (args, filesize) {
	var minArg = parseFloat(args.min);
	var maxArg = parseFloat(args.max);
	var startArg = parseInt(args.start, 10);
	var stopArg = parseInt(args.stop, 10);

	if (isNaN(minArg)) {
		minArg = undefined;
	}
	if (isNaN(maxArg)) {
		maxArg = undefined;
	}
	if (isNaN(startArg)) {
		startArg = undefined;
	}
	if (isNaN(stopArg)) {
		stopArg = undefined;
	}

	var startByte;
	var stopByte;

	if (!minArg && !maxArg && !startArg && !stopArg) {
		throw new Error('Must specify --min and --max or --start and --stop');
	}

	if ((minArg || maxArg) && (startArg || stopArg)) {
		throw new Error(
			'Cannot use both min/max and start/stop entry methods; ' +
			'use --min and --max alone or use --start and --stop alone'
		);
	}

	if (startArg || stopArg) {
		if (startArg === undefined || stopArg === undefined) {
			throw new Error('Must specify both --start and --stop');
		}

		if (startArg < 0) {
			throw new Error('--start cannot be less than 0');
		}
		if (stopArg > filesize) {
			throw new Error('--stop cannot be larger than filesize (' + filesize + ')');
		}

		return {
			start: startArg,
			stop: stopArg
		};
	}

	if (minArg || maxArg) {
		if (minArg === undefined || maxArg === undefined) {
			throw new Error('Must specify both --min and --max');
		}

		return {
			start: Math.floor( filesize * minArg ),
        	stop: Math.floor( filesize * maxArg )
		};
	}
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

module.exports = {
	getRandomInt: getRandomInt,
	determineModificationRange: determineModificationRange
};
