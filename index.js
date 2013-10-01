var observable = require('observable');
var supportsTouch = require('feature/touch');

module.exports = function(target, opts) {
  var log = observable();

  // bind to targets
  (supportsTouch ? bindTouch : bindMouse).call(null, {
    start: (opts || {}).start || target,
    move: (opts || {}).move || target,
    end: (opts || {}).end || target
  }, log, target);

  return log;
};

function bindTouch(targets, log) {
  // add the appropriate listeners
  targets.start.addEventListener('touchstart', function(evt) {
    var touch = evt.changedTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'start' } ]);
  });

  targets.move.addEventListener('touchmove', function(evt) {
    var touch = evt.targetTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'move' } ]);
  });

  targets.end.addEventListener('touchend', function(evt) {
    var touch = evt.changedTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'end' }]);
  });
}

function bindMouse(targets, log) {
  var isDown = false;

  targets.start.addEventListener('mousedown', function(evt) {
    isDown = isDown || (evt.button === 0);
    log([ evt.pageX, evt.pageY, { type: 'start' } ]);
  });

  targets.move.addEventListener('mousemove', function(evt) {
    if (! isDown) {
      return;
    }

    log([ evt.pageX, evt.pageY, { type: 'move' } ]);
  });

  targets.end.addEventListener('mouseup', function(evt) {
    log([ evt.pageX, evt.pageY, { type: 'end' } ]);
  });

  // mouse up events are handled at the document level
  document.addEventListener('mouseup', function(evt) {
    isDown = isDown && (evt.button !== 0);
  });
}