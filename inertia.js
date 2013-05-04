var through = require('through');

function generateInertia(identifiers, deltas, duration) {
    console.log(identifiers);
    console.log(deltas);

    return 0;
}

module.exports = function(options) {
    var calcInterval = 0,
        opts = options || {},
        damping = opts.damping || 0.7,
        resetDelay = opts.resetDelay || 100,
        deltas = [],
        positions,
        tick,
        ii;

    function write(data) {
        var parts = data.split(':'),
            newPositions = parts.slice(1).map(function(data) {
                return data.split(',');
            }),
            identifiers,
            newTick = Date.now(),
            tickDiff;

        if (positions) {
            tickDiff = (newTick - tick) || 1;

            // if we have hit the ms cutoff, then reset the deltas
            if (tickDiff > resetDelay) {
                deltas = [];
                deltaCount = 0;
            }
            else {
                // create the new delta set
                deltas[deltas.length] = [];

                // iterate through the positions and add to the delta
                for (ii = positions.length; ii--; ) {
                    deltas[deltas.length - 1][ii] = {
                        x: newPositions[ii][0] - positions[ii][0],
                        y: positions[ii][1] - newPositions[ii][1],
                        t: tickDiff
                    };
                }
            }
        }

        // if we received an 'end' event then generate inertia
        if (parts[0] === 'end') {
            // extract the touch identifiers
            identifiers = ;

            // apply inertia
            calcInterval = generateInertia(
                // extract the identifiers
                parts.slice(1).map(function(data) {
                    return parseInt(data.split(',')[0], 10);
                }),

                // send a copy of the deltas
                [].concat(deltas),

                // inertia duration
                opts.duration || 100
            );

            // reset velocity calcs
            positions = undefined;
            deltas = [];
            deltaCount = 0;
        }
        // otherwise, do the normal stuff
        else {
            if (calcInterval) {
                clearInterval(calcInterval);
                calcInterval = 0;
            }

            // positions and tick
            positions = newPositions;
            tick = newTick;

            // pass through the data
            this.emit('data', data);
        }
    }

    function end() {
        this.emit('end');
    }

    return through(write, end);
};