/* jshint node: true */
/* global document: false */
'use strict';

var Observ = require('observ');
var supportsTouch = require('feature/touch');
/**
  # point

  Use [observable](https://github.com/dominictarr/observable) (well, actually
  [Observ](https://github.com/Raynos/observ) now) to monitor mouse and touch
  events.

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

  ## Advanced Example: Replacing Interact

  Using this module in conjunction with a
  [pull-stream](https://github.com/dominictarr/pull-stream) and
  [pull-observable](https://github.com/DamonOehlman/pull-observable) it is
  possible to replicate the function of a library that I wrote a few years
  ago called [interact](https://github.com/DamonOehlman/interact).  Interact
  was designed to capture bound events and send them to a message bus Using
  [eve](https://github.com/adobewebplatform/eve):

  <<< examples/publish-to-bus.js

  ## Reference

  ### `point(target, opts?) => Observ`

  Create a new [Observable](https://github.com/Raynos/observ) that will be
  updated in response to pointer movement on the specified `target`.

  The following options can be provided to tweak behaviour:

  - `over` - capture mouse over events in addition to mouse move events
  - `preventDefault` - whether the default event behaviour should be
    prevented in the browser event listeners.

**/
module.exports = function(target, opts) {
  var log = Observ([]);
  var preventDefault = (opts || {}).preventDefault;

  function update(data) {
    var evt = data[3];
    if (preventDefault) {
      evt.preventDefault();
    }
    log.set(data);
  }

  // bind to targets
  bindMouse.call(null, {
    start: (opts || {}).start || target,
    move: (opts || {}).move || target,
    end: (opts || {}).end || target
  }, update, opts);

  if(supportsTouch) bindTouch.call(null, {
    start: (opts || {}).start || target,
    move: (opts || {}).move || target,
    end: (opts || {}).end || target
  }, update, opts);

  return log;
};

function bindTouch(targets, update, opts) {
  // add the appropriate listeners
  targets.start.addEventListener('touchstart', function(evt) {
    var touch = evt.changedTouches[0];

    update([ touch.pageX, touch.pageY, { type: 'start' }, evt ]);
  });

  targets.move.addEventListener('touchmove', function(evt) {
    var touch = evt.targetTouches[0];

    update([ touch.pageX, touch.pageY, { type: 'move' }, evt ]);
  });

  targets.end.addEventListener('touchend', function(evt) {
    var touch = evt.changedTouches[0];

    update([ touch.pageX, touch.pageY, { type: 'end' }, evt ]);
  });
}

function bindMouse(targets, update, opts) {
  var isDown = false;
  var captureOver = (opts || {}).over;

  targets.start.addEventListener('mousedown', function(evt) {
    isDown = isDown || (evt.button === 0);
    update([ evt.pageX, evt.pageY, { type: 'start' }, evt ]);
  });

  targets.move.addEventListener('mousemove', function(evt) {
    var eventType = isDown ? 'move' : 'over';
    if (eventType === 'over' && (! captureOver)) {
      return;
    }

    update([ evt.pageX, evt.pageY, { type:  eventType }, evt ]);
  });

  targets.end.addEventListener('mouseup', function(evt) {
    update([ evt.pageX, evt.pageY, { type: 'end' }, evt ]);
  });

  // mouse up events are handled at the document level
  document.addEventListener('mouseup', function(evt) {
    isDown = isDown && (evt.button !== 0);
  });
}
