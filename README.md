# point

Use [observable](https://github.com/dominictarr/observable) (well, actually
[Observ](https://github.com/Raynos/observ) now) to monitor mouse and touch
events.


[![NPM](https://nodei.co/npm/point.png)](https://nodei.co/npm/point/)

[![unstable](https://img.shields.io/badge/stability-unstable-yellowgreen.svg)](https://github.com/dominictarr/stability#unstable) 

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
- dblclick (when `doubleClick` is passed)

## Advanced Example: Replacing Interact

Using this module in conjunction with a
[pull-stream](https://github.com/dominictarr/pull-stream) and
[pull-observable](https://github.com/DamonOehlman/pull-observable) it is
possible to replicate the function of a library that I wrote a few years
ago called [interact](https://github.com/DamonOehlman/interact).  Interact
was designed to capture bound events and send them to a message bus Using
[eve](https://github.com/adobewebplatform/eve):

```js
var pull = require('pull-stream');
var observe = require('pull-observable');
var point = require('point');
var eve = require('eve');

eve.on('pointer.*', function(x, y) {
  console.log('captured: ' + eve.nt() + ' @ ', x, y);
});

pull(
  observe(point(document)),
  pull.drain(function(args) {
    var type = (args[2] || {}).type;

    eve.apply(null, ['pointer.' + type, args[3]].concat(args.slice(0, 2)));
  })
);


```

## Reference

### `point(target, opts?) => Observ`

Create a new [Observable](https://github.com/Raynos/observ) that will be
updated in response to pointer movement on the specified `target`.

The following options can be provided to tweak behaviour:

- `over` - capture mouse over events in addition to mouse move events
- `preventDefault` - whether the default event behaviour should be
  prevented in the browser event listeners.
- `doubleClick` - capture double click events in addition to other events

## License(s)

### MIT

Copyright (c) 2016 Damon Oehlman <damon.oehlman@gmail.com>

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
'Software'), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED 'AS IS', WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY
CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT,
TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
