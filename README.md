# point

Use [observable](https://github.com/dominictarr/observable) to monitor
mouse and touch events.


[![NPM](https://nodei.co/npm/point.png)](https://nodei.co/npm/point/)


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

At this stage, the data object [2] simply tells you the type of the pointer
event, with three possible values:

- start
- move
- end
