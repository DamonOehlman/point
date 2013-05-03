var Stream = require('stream'),
    supportsTouch = require('feature/touch');

function fakeTouch(evt) {
    return [{
        identifier: evt.button,
        pageX: evt.pageX,
        pageY: evt.pageY
    }];
}

var capture = exports.capture = function(node, options) {
    // create the new stream
    var stream = new Stream(),
        opts = options || {},
        startTarget = opts.start || node,
        moveTarget = opts.move || node,
        endTarget = opts.end || node,
        isDown = false;

    function data(type, touches, evt) {
        touches = [].slice.call(touches).map(function(touch) {
            return [touch.identifier, touch.pageX, touch.pageY];
        });

        stream.emit('data', [type].concat(touches).join(':'), evt);
    }

    // if this interface supports touch, use touch events
    if (supportsTouch) {
        // add the appropriate listeners
        startTarget.addEventListener('touchstart', function(evt) {
            data('start', evt.changedTouches, evt);
        });

        moveTarget.addEventListener('touchmove', function(evt) {
            data('move', evt.targetTouches, evt);
        });

        endTarget.addEventListener('touchend', function(evt) {
            data('end', evt.changedTouches, evt);
        });
    }
    // otherwise, capture mouse events
    else {
        startTarget.addEventListener('mousedown', function(evt) {
            isDown = isDown || (evt.button === 0);
            data(
                'start', fakeTouch(evt), evt);
        });

        moveTarget.addEventListener('mousemove', function(evt) {
            if (isDown) {
                data('move', fakeTouch(evt), evt);
            }
        });

        endTarget.addEventListener('mouseup', function(evt) {
            data('end', fakeTouch(evt), evt);
        });

        // mouse up events are handled at the document level
        document.addEventListener('mouseup', function(evt) {
            isDown = isDown && (evt.button !== 0);
        });
    }

    return stream;
};

exports.parse = function(data) {
    // split on : to get parts
    var parts = data.split(':');

    return {
        type: parts[0],
        touches: parts.slice(1).map(function(touchData) {
            var args = touchData.split(',');

            return {
                id: parseInt(args[0], 10),
                x:  parseInt(args[1], 10),
                y:  parseInt(args[2], 10)
            };
        })
    };
};