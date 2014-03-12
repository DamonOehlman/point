/* jshint node: true */
/* global document: false */
'use strict';

var observable = require('observable');
var supportsTouch = require('feature/touch');

/**
  # point

  Use [observable](https://github.com/dominictarr/observable) to monitor
  mouse and touch events.

  ## Usage

  First bind to the element you wish to capture data for.  In this case
  let's capture data at the document level:

  ```js
  var point = require('point')(document);
  ```

  Now to receive the pointer events simply pass point a function that will
  process the data:

  ```js
  point(function(args) {
    console.log(args);
  });
  ```

  The event data is passed to the function as a 4 element array:

  ```js
  [ pageX, pageY, data, originalEvent ]
  ```

  At this stage, the data object `args[2]` simply tells you the type of the
  pointer event:

  ```js
  { type: 'start' }
  ```

  Possible values:
  
  - start
  - move
  - end

**/
module.exports = function(target, opts) {
  var log = observable();

  // bind to targets
  (supportsTouch ? bindTouch : bindMouse).call(null, {
    start: (opts || {}).start || target,
    move: (opts || {}).move || target,
    end: (opts || {}).end || target
  }, log, opts);

  return log;
};

function bindTouch(targets, log, opts) {
  // add the appropriate listeners
  targets.start.addEventListener('touchstart', function(evt) {
    var touch = evt.changedTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'start' }, evt ]);
  });

  targets.move.addEventListener('touchmove', function(evt) {
    var touch = evt.targetTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'move' }, evt ]);
  });

  targets.end.addEventListener('touchend', function(evt) {
    var touch = evt.changedTouches[0];

    log([ touch.pageX, touch.pageY, { type: 'end' }, evt ]);
  });
}

function bindMouse(targets, log, opts) {
  var isDown = false;
  var captureOver = (opts || {}).over;

  targets.start.addEventListener('mousedown', function(evt) {
    isDown = isDown || (evt.button === 0);
    log([ evt.pageX, evt.pageY, { type: 'start' }, evt ]);
  });

  targets.move.addEventListener('mousemove', function(evt) {
    var eventType = isDown ? 'move' : 'over';
    if (eventType === 'over' && (! captureOver)) {
      return;
    }

    log([ evt.pageX, evt.pageY, { type:  eventType }, evt ]);
  });

  targets.end.addEventListener('mouseup', function(evt) {
    log([ evt.pageX, evt.pageY, { type: 'end' }, evt ]);
  });

  // mouse up events are handled at the document level
  document.addEventListener('mouseup', function(evt) {
    isDown = isDown && (evt.button !== 0);
  });
}