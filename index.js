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
        target = opts.target || node,
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
        node.addEventListener('touchstart', function(evt) {
            data('start', evt.changedTouches, evt);
        });

        node.addEventListener('touchmove', function(evt) {
            data('move', evt.targetTouches, evt);
        });

        node.addEventListener('touchend', function(evt) {
            data('end', evt.changedTouches, evt);
        });
    }
    // otherwise, capture mouse events
    else {
        node.addEventListener('mousedown', function(evt) {
            isDown = isDown || (evt.button === 0);
            data(
                'start', fakeTouch(evt), evt);
        });

        node.addEventListener('mousemove', function(evt) {
            if (isDown) {
                data('move', fakeTouch(evt), evt);
            }
        });

        node.addEventListener('mouseup', function(evt) {
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