var Stream = require('stream'),
    supportsTouch = require('feature/touch');

var capture = exports.capture = function(node, options) {
    // create the new stream
    var stream = new Stream(),
        opts = options || {},
        target = opts.target || node;

    function data(type, touches, evt) {
        touches = [].slice.call(touches).map(function(touch) {
            return [touch.identifier, touch.pageX, touch.pageY];
        });

        stream.emit('data', [type].concat(touches).join(':'), evt);
    }

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

    // TODO: if the interface does not support touch, then capture mouse events and broadcast as touch

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