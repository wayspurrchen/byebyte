function determineModificationRange (opts, filesize) {
	var minArg = parseFloat(opts.min);
	var maxArg = parseFloat(opts.max);
	var startArg = parseInt(opts.start, 10);
	var stopArg = parseInt(opts.stop, 10);

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

function checkArguments(opts) {
    var hasMinMax = opts.min !== undefined || opts.max !== undefined;
    var hasStartStop = opts.start !== undefined || opts.stop !== undefined;

    if (hasMinMax && hasStartStop) {
      throw new Error('min/max and start/stop cannot be used together');  
    }

    if (hasStartStop && opts.stop === undefined) {
      throw new Error('stop must be provided');
    }

    if (hasStartStop && opts.start === undefined) {
      throw new Error('start must be provided');
    }

    if (hasMinMax && opts.max === undefined) {
      throw new Error('max must be provided');
    }

    if (hasMinMax && opts.min === undefined) {
      throw new Error('min must be provided');
    }

    if ((opts.min || 0) < 0) {
      throw new Error('min must be >= 0');
    }

    if ((opts.max || 0) > 1) {
      throw new Error('max must be <= 1');
    }

    if ((opts.start || 0) < 0) {
      throw new Error('start must be >= 0');
    }
}

module.exports = {
   	checkArguments: checkArguments,
	getRandomInt: getRandomInt,
	determineModificationRange: determineModificationRange
};
